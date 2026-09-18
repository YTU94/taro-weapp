import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Picker, Image, Text } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import { DICE_IMAGES, DICE_BG, SHAKE_ICON } from '../../utils/images'
import '../../styles/page-common.less'
import './index.less'

const DICE_NUM_LIST = [1, 2, 3, 4, 5, 6]

function randomNum(n) {
    return Math.ceil(Math.random() * n)
}

export default function Index() {
    const [diceNum, setDiceNum] = useState(5)
    const [diceList, setDiceList] = useState([])
    const [showDice, setShowDice] = useState(false)

    useShareAppMessage(() => ({
        path: '/pages/tabBar/index/index'
    }))

    const init = () => {
        const list = []
        for (let i = 0; i < diceNum; i++) list.push(randomNum(6))
        setShowDice(false)
        setDiceList(list)
    }

    // 摇一摇：把最新的 init 放进 ref，避免加速度监听闭包读到旧的骰子数量
    const initRef = useRef(init)
    initRef.current = init

    useEffect(() => {
        Taro.startAccelerometer({ interval: 'game' })
        Taro.onAccelerometerChange(e => {
            if (e.x > 0.6 || e.y > 0.6) {
                Taro.showToast({ title: '摇好啦', icon: 'success', duration: 800 })
                initRef.current()
            }
        })
        return () => {
            try {
                Taro.stopAccelerometer({})
            } catch (e) {}
        }
    }, [])

    const onChange = e => setDiceNum(parseInt(e.detail.value) + 1)

    const openDice = () => {
        if (diceList.length > 0) {
            setShowDice(true)
        } else {
            Taro.showToast({ title: '请先摇一摇', icon: 'none', duration: 1000 })
        }
    }

    const imgList = diceList.map((item, index) => (
        <Image key={index} className='dice-img' src={DICE_IMAGES[item]} mode='widthFix' />
    ))

    return (
        <View className='page dice-game'>
            <View className='page-header'>
                <View className='icon-tile t-dice'>
                    <View className='die-icon'>
                        <View className='die-die' />
                    </View>
                </View>
                <View>
                    <View className='page-title'>骰子游戏</View>
                    <View className='page-sub'>选好数量，摇一摇，开骰盅</View>
                </View>
            </View>

            <View className='card dice-card'>
                <View className='dice-card-header'>
                    <View className='dice-card-label'>骰子数量</View>
                    <Picker mode='selector' range={DICE_NUM_LIST} onChange={onChange}>
                        <View className='dice-picker'>
                            <Text className='dice-picker-num'>{diceNum}</Text>
                            <View className='dice-picker-caret' />
                        </View>
                    </Picker>
                </View>
                <View className='dice-cup'>
                    <Image
                        className={diceList.length > 0 ? 'dice-cup-img opened' : 'dice-cup-img'}
                        src={DICE_BG}
                        mode='widthFix'
                    />
                    <View className='dice-grid'>
                        {showDice && diceList.length > 0 ? (
                            imgList
                        ) : (
                            <View className='dice-placeholder'>{diceList.length > 0 ? '准备开' : '等待摇一摇'}</View>
                        )}
                    </View>
                </View>
                <View className='shake-text' onClick={init}>
                    <View className='shake-arrow'>
                        <Image className='shake-img' src={SHAKE_ICON} mode='widthFix' />
                    </View>
                    <View>摇一摇 / 点击开始</View>
                </View>
            </View>

            <View className='bottom-bar'>
                <View
                    className='primary-btn'
                    hoverClass='primary-btn-active'
                    onClick={openDice}
                >
                    开！！
                </View>
            </View>
        </View>
    )
}