import { View, Text } from '@tarojs/components'
import './index.less'

// 纯 CSS 自绘扑克牌 / 骰子 —— 替代原 Wikimedia 远程图片
// 同时消除小程序端 downloadFile 合法域名依赖，可离线渲染

const SUITS = ['♠', '♥', '♣', '♦'] // 每组 13 张的顺序
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export function cardInfo(num) {
    // num: 1-52 普通牌，53 小王，54 大王
    if (num >= 53) {
        return { joker: num === 53 ? '小王' : '大王', red: num === 54 }
    }
    const suit = SUITS[Math.floor((num - 1) / 13)]
    const rank = RANKS[(num - 1) % 13]
    return { suit, rank, red: suit === '♥' || suit === '♦' }
}

export function PokerCard({ num, className = '' }) {
    const info = cardInfo(num)
    const c = info.red ? 'red' : 'blk'
    if (info.joker) {
        return (
            <View className={`pk-card pk-sm ${className}`}>
                <Text className={`pk-corner-txt ${c}`}>{info.red ? '★' : '☆'}</Text>
                <View className={`pk-joker ${c}`}>{info.joker}</View>
                <Text className={`pk-corner-txt pk-corner-flip ${c}`}>{info.red ? '★' : '☆'}</Text>
            </View>
        )
    }
    return (
        <View className={`pk-card ${className}`}>
            <View className='pk-corner'>
                <Text className={`pk-rank ${c}`}>{info.rank}</Text>
                <Text className={`pk-suit-s ${c}`}>{info.suit}</Text>
            </View>
            <Text className={`pk-suit-big ${c}`}>{info.suit}</Text>
            <View className='pk-corner pk-corner-flip'>
                <Text className={`pk-rank ${c}`}>{info.rank}</Text>
                <Text className={`pk-suit-s ${c}`}>{info.suit}</Text>
            </View>
        </View>
    )
}

// 点数 → 3x3 网格位置（0-8）
const PIPS = {
    1: [4],
    2: [2, 6],
    3: [2, 4, 6],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
}

export function Die({ value, small = false, delay = 0 }) {
    const pips = PIPS[value] || PIPS[1]
    const cells = Array.from({ length: 9 }, (_, i) => (
        <View key={i} className={`die-cell${pips.includes(i) ? ' die-cell-on' : ''}`} />
    ))
    return (
        <View
            className={`die-face${small ? ' die-small' : ''}`}
            style={delay ? { animationDelay: delay + 'ms' } : undefined}
        >
            {cells}
        </View>
    )
}
