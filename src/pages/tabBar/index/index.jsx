import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

const TITLE = '酒桌Gameing'
const SUBTITLE = '聚会助兴 · 5 款小游戏'

const GAMES = [
    { url: '/pages/pukeGame/index', icon: 'puke', title: '扑克牌', desc: '随机抽牌比大小' },
    { url: '/pages/flopGame/index', icon: 'flop', title: '文字翻牌', desc: '翻牌决定小惩罚' },
    { url: '/pages/diceGame/index', icon: 'dice', title: '摇色子', desc: '摇一摇掷出点数' },
    { url: '/pages/rotateGame/index', icon: 'wheel', title: '大转盘', desc: '转到什么做什么' },
    { url: '/pages/twentyFourGame/index', icon: 'twenty', title: '24点', desc: '四张牌巧算 24' }
]

const ICONS = {
    puke: (
        <View className='mini-card c-red'>
            <Text>A</Text>
        </View>
    ),
    flop: (
        <View className='mini-card'>
            <Text>?</Text>
        </View>
    ),
    dice: <View className='die' />,
    wheel: <View className='wheel-ic' />,
    twenty: (
        <View className='mini-card card-24'>
            <Text>24</Text>
        </View>
    )
}

export default function Index() {
    useShareAppMessage(() => {
        return {
            path: '/pages/tabBar/index/index'
        }
    })

    const openPage = url => {
        url && Taro.navigateTo({ url })
    }

    return (
        <View className='home'>
            <View className='hero'>
                <View className='hero-title'>{TITLE}</View>
                <View className='hero-sub'>{SUBTITLE}</View>
            </View>

            <View className='tips'>点击右上角「···」-「添加到我的小程序」，下次访问更便捷</View>

            <View className='grid'>
                {GAMES.map((g, i) => (
                    <View
                        key={g.url}
                        className={`card${i === GAMES.length - 1 ? ' wide' : ''}`}
                        hoverClass='card-active'
                        hoverStayTime='120'
                        onClick={() => openPage(g.url)}
                    >
                        <View className={`icon-tile t-${g.icon}`}>{ICONS[g.icon]}</View>
                        <View className='card-body'>
                            <View className='card-title'>{g.title}</View>
                            <View className='card-desc'>{g.desc}</View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}
