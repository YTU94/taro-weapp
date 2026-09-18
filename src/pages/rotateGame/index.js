import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import { AtButton } from 'taro-ui'
import CusInput from '../../components/cusInput'
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

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //不含最大值，含最小值
}

export default function Index() {
    const [num, setNum] = useState(1)
    const [cusList, setCusList] = useState([])
    const [showInput, setShowInput] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)
    const timer = useRef(null)

    useShareAppMessage(() => {
        return {
            path: '/pages/tabBar/index/index'
        }
    })

    useEffect(() => {
        return () => {
            timer.current && clearTimeout(timer.current)
        }
    }, [])

    const start = e => {
        e.stopPropagation()
        if (btnDisabled) return
        setNum(n => n + getRandomInt(360, 1800))
        setBtnDisabled(true)
        timer.current = setTimeout(() => {
            setBtnDisabled(false)
        }, 5000)
    }

    const clear = e => {
        e.stopPropagation()
        setCusList([])
    }

    const onSubmit = v => {
        if (cusList.length > MAX_OPTIONS) {
            Taro.showToast({
                title: '最多支持10个自定义选项',
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

    const arr = cusList.length >= MAX_OPTIONS ? cusList.slice(0, MAX_OPTIONS) : cusList.concat(DEFAULT_LIST.slice(cusList.length))
    const l = arr.length

    const rotateBox = arr.map((item, i) => (
        <View key={i} className='sector' style={`transform: rotate(${i * (360 / l)}deg)`}>
            <View className='sector-inner' style={`transform: translatex(-250rpx) rotate(${360 / l}deg)`}>
                <Text
                    style={`transform: translate(0, -100%) rotate(-${360 / arr.length / 2}deg); width: ${(
                        Math.sin(((360 / arr.length / 2) * Math.PI) / 180).toFixed(8) * 160
                    )}%`}
                >
                    {item}
                </Text>
            </View>
        </View>
    ))

    return (
        <View className='rotate-game'>
            <View className='title'> 超级转盘 </View>
            <View style='display:flex; justify-content:space-between;padding: 10rpx 40rpx;box'>
                <View onClick={showInputBox}>
                    <AtButton className='cus-btn' size='small' type='secondary'>
                        自定义转盘
                    </AtButton>
                </View>

                <View>
                    <AtButton className='cus-btn' size='small' onClick={clear}>
                        清空
                    </AtButton>
                </View>
            </View>

            <View className='rotate-box'>
                <View style={`transform: translate(-50%, 0) rotate(${num}deg);`} className='ani-rotate'>
                    {rotateBox}
                </View>
                <View className='rotate-pointer'>结果</View>
            </View>

            {showInput ? (
                <CusInput show={showInput} onSubmit={onSubmit} onBlur={blur} />
            ) : (
                <AtButton className='action-btn' type='primary' disabled={btnDisabled} onClick={start}>
                    开始
                </AtButton>
            )}
        </View>
    )
}
