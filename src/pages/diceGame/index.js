import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Picker, Image } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import { AtButton } from 'taro-ui'
import { DICE_IMAGES, DICE_BG, SHAKE_ICON } from '../../utils/images'
import './index.less'

const DICE_NUM_LIST = [1, 2, 3, 4, 5, 6]

function randomNum(params) {
    return Math.ceil(Math.random() * params)
}

export default function Index() {
    const [diceNum, setDiceNum] = useState(5)
    const [diceList, setDiceList] = useState([])
    const [showDice, setShowDice] = useState(false)

    useShareAppMessage(() => {
        return {
            path: '/pages/tabBar/index/index'
        }
    })

    const init = () => {
        const list = []
        for (let i = 0; i < diceNum; i++) {
            list.push(randomNum(6))
        }
        setShowDice(false)
        setDiceList(list)
    }

    // 摇一摇：把最新的 init 放进 ref，避免加速度监听闭包读到旧的骰子数量
    const initRef = useRef(init)
    initRef.current = init

    useEffect(() => {
        Taro.onAccelerometerChange(e => {
            if (e.x > 0.6 || e.y > 0.6) {
                Taro.showToast({
                    title: '摇好啦👌',
                    icon: 'success',
                    duration: 1000
                })
                initRef.current()
            }
        })
        return () => {
            Taro.stopAccelerometer()
        }
    }, [])

    const onChange = e => {
        setDiceNum(parseInt(e.detail.value) + 1)
    }

    const openDice = () => {
        if (diceList.length > 0) {
            setShowDice(true)
        } else {
            Taro.showToast({
                title: '请先摇一摇',
                icon: 'none',
                duration: 1000
            })
        }
    }

    const imgList = diceList.map((item, index) => {
        return <Image key={index} className='dice-img' src={DICE_IMAGES[item]} mode='widthFix' />
    })

    return (
        <View className='dice-game'>
            <View className='dice-num'>
                <Picker mode='selector' range={DICE_NUM_LIST} onChange={onChange}>
                    <View className='dice-picker'>
                        🎲 X {diceNum} <View className='at-icon at-icon-chevron-down'></View>{' '}
                    </View>{' '}
                </Picker>{' '}
            </View>
            <View className='title'> 骰子游戏 </View>
            <View className='dice-bg'>
                <View className='dice-box'> {showDice && imgList} </View>
                <Image
                    className={diceList.length > 0 ? 'dice-bg-img dice-bg-active' : 'dice-bg-img'}
                    src={DICE_BG}
                    mode='widthFix'
                />
                <View className='shake-text' onClick={init}>
                    摇一摇 <Image className='shake-img' src={SHAKE_ICON} mode='widthFix' />
                </View>{' '}
            </View>
            <AtButton className='opt-btn' type='primary' onClick={openDice}>
                开！！{' '}
            </AtButton>{' '}
        </View>
    )
}
