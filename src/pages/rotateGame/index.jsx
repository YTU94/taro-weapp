import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import CusInput from '../../components/cusInput'
import '../../styles/page-common.less'
import './index.less'

const DEFAULT_LIST = [
    'PASS',
    '再来一次',
    '喝一杯',
    '讲故事',
    '喝一瓶',
    '喝半杯',
    '大冒险',
    '大家干杯',
    '选人喝一杯',
    '赢家说了算'
]

const MAX_OPTIONS = 10
const SPIN_MS = 5000
// 扇区底色 / 文字色（交替使用）
const SECTOR_COLORS = ['#fdebc8', '#f6b352']
const TEXT_COLORS = ['#d9482b', '#7a3c10']

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //不含最大值，含最小值
}

export default function Index() {
    const [num, setNum] = useState(0) // 累计旋转角度
    const [spinning, setSpinning] = useState(false)
    const [result, setResult] = useState('')
    const [cusList, setCusList] = useState([])
    const [showInput, setShowInput] = useState(false)
    const timer = useRef(null)

    useShareAppMessage(() => ({
        path: '/pages/tabBar/index/index'
    }))

    useEffect(() => {
        return () => {
            timer.current && clearTimeout(timer.current)
        }
    }, [])

    const arr =
        cusList.length >= MAX_OPTIONS
            ? cusList.slice(0, MAX_OPTIONS)
            : cusList.concat(DEFAULT_LIST.slice(cusList.length))
    const l = arr.length
    const step = 360 / l

    const start = () => {
        if (spinning) return
        // 先随机选中奖区块，再反推需要转到的角度，保证指针停在区块内部（不压线）
        const target = getRandomInt(0, l)
        const jitter = (Math.random() - 0.5) * (step - 16) // 区块内随机偏移，避免每次都停正中
        const base = -step * target - step / 2 + jitter
        const delta = ((((base - num) % 360) + 360) % 360) + 360 * getRandomInt(4, 7)
        setNum(num + delta)
        setSpinning(true)
        setResult('')
        timer.current = setTimeout(() => {
            setSpinning(false)
            setResult(arr[target])
            Taro.showToast({ title: arr[target], icon: 'none', duration: 2000 })
        }, SPIN_MS + 100)
    }

    const clear = e => {
        e.stopPropagation()
        setCusList([])
    }

    const onSubmit = v => {
        if (cusList.length >= MAX_OPTIONS) {
            Taro.showToast({
                title: `最多支持${MAX_OPTIONS}个自定义选项`,
                icon: 'none',
                duration: 1500
            })
            return false
        }
        if (!v) {
            Taro.showToast({
                title: '内容不能为空',
                icon: 'none',
                duration: 1500
            })
            return false
        }
        setCusList(prev => prev.concat(v))
    }

    const blur = () => {
        setShowInput(false)
    }

    const showInputBox = e => {
        e.stopPropagation()
        if (showInput) return
        setShowInput(true)
    }

    // conic-gradient 一次画出全部扇区（不支持时回退为纯色）
    const gradient = `conic-gradient(${arr
        .map((_, i) => `${SECTOR_COLORS[i % 2]} ${i * step}deg ${(i + 1) * step}deg`)
        .join(', ')})`

    // 文字沿扇区中线（切向排布），transform-origin 0 0 即转盘圆心
    const sectors = arr.map((item, i) => (
        <View
            key={i}
            className='sector-text'
            style={{
                transform: `rotate(${i * step + step / 2}deg) translate(-50%, -208rpx)`,
                color: TEXT_COLORS[i % 2]
            }}
        >
            {item}
        </View>
    ))

    return (
        <View className='rotate-game'>
            <View className='page-header'>
                <View className='icon-tile t-wheel'>
                    <View className='wheel-mini' />
                </View>
                <View>
                    <View className='page-title'>超级转盘</View>
                    <View className='page-sub'>转到什么做什么，自己也能改规则</View>
                </View>
            </View>

            <View className='toolbar'>
                <View
                    className='tool-btn'
                    hoverClass='tool-btn-active'
                    onClick={showInputBox}
                >
                    自定义转盘
                </View>
                <View
                    className='tool-btn'
                    hoverClass='tool-btn-active'
                    onClick={clear}
                >
                    清空
                </View>
            </View>

            <View className='rotate-box'>
                <View className='wheel-wrap'>
                    <View
                        className='wheel-rotator'
                        style={{ backgroundImage: gradient, transform: `rotate(${num}deg)` }}
                    >
                        {sectors}
                    </View>
                    {/* 顶部指针（固定不转） */}
                    <View className='wheel-pin' />
                    {/* 中心按钮：可点击开转，结束后显示结果 */}
                    <View className='wheel-hub' onClick={start}>
                        <Text className='wheel-hub-txt'>{spinning ? '转动中' : result || '开始'}</Text>
                    </View>
                </View>
            </View>

            {showInput ? (
                <CusInput show={showInput} onSubmit={onSubmit} onBlur={blur} />
            ) : (
                <View
                    className={`action-btn${spinning ? ' action-btn-disabled' : ''}`}
                  hoverClass={spinning ? '' : 'action-btn-active'}
                    onClick={start}
                >
                    开始
                </View>
            )}
        </View>
    )
}