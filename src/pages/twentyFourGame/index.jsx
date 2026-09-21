import { useShareAppMessage } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { PokerCard } from '../../components/faces'
import PlayerBar from '../../components/playerBar'
import '../../styles/page-common.less'
import './index.less'

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function pickThree() {
    const arr = []
    while (arr.length < 3) {
        const i = getRandomInt(1, 53)
        if (!arr.includes(i)) arr.push(i)
    }
    return arr
}

export default function Index() {
    const [numArr, setNumArr] = useState([])

    useShareAppMessage(() => ({
        title: '24点',
        path: '/pages/tabBar/index/index'
    }))

    // 进入页面先发 3 张
    useEffect(() => {
        setNumArr(pickThree())
    }, [])

    const start = () => setNumArr(pickThree())

    return (
        <View className='page twentyFour-game'>
            <View className='page-header'>
                <View className='icon-tile t-twenty'>
                    <View className='mini-card card-24'>
                        <View className='mini-card-inner'>24</View>
                    </View>
                </View>
                <View>
                    <View className='page-title'>24 点</View>
                    <View className='page-sub'>用 + − × ÷ 把 3 张牌算出 24</View>
                </View>
            </View>

            <View className='card card-preview'>
                {numArr.length === 3 ? (
                    <View className='cards-row'>
                        {numArr.map(e => (
                            <View key={e} className='card-slot'>
                                <PokerCard num={e} />
                            </View>
                        ))}
                    </View>
                ) : (
                    <View className='card-loading'>正在准备牌组…</View>
                )}
                <View className='card-tips'>点击「换一组」随机抽 3 张新牌</View>
            </View>

            <View className='section-title'>玩法介绍</View>
            <View className='expain'>
                <View>看谁最快利用 + − × ÷ 将 3 张扑克牌计算出 24。</View>
                <View>JQK 视作 11、12、13，不能用括号以外的额外运算。</View>
                <View>答不上来的请喝酒。</View>
            </View>

            <View className='bottom-bar'>
                <View
                    className='primary-btn'
                    hoverClass='primary-btn-active'
                    onClick={start}
                >
                    换一组
                </View>
            </View>

            <PlayerBar fixed />
        </View>
    )
}