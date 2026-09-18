import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { useState } from 'react'
import '../../styles/page-common.less'
import './index.less'

const CARD_COUNT = 9
const DEFAULT_TEXT = '翻牌文字'

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

/**
 * 生成 9 张牌，随机把文字填进牌面
 * 等价于原 dos() 的逻辑；文字超过 9 个字时截断
 */
function makeCards(text) {
    const chars = String(text || '').split('').slice(0, CARD_COUNT)
    const cards = Array.from({ length: CARD_COUNT }, (_, i) => ({
        key: String(i + 1),
        value: '',
        hasClick: false
    }))
    let i = 0
    while (i < chars.length) {
        const r = getRandomInt(0, cards.length)
        if (!cards[r].value) {
            cards[r].value = chars[i]
            i++
        }
    }
    return cards
}

export default function Index() {
    const [value, setValue] = useState(DEFAULT_TEXT)
    const [inputValue, setInputValue] = useState('')
    const [squal, setSqual] = useState(() => makeCards(DEFAULT_TEXT))

    useShareAppMessage(() => ({
        path: '/pages/tabBar/index/index'
    }))

    const flop = index => {
        setSqual(prev => prev.map((item, i) => (i === index ? { ...item, hasClick: true } : item)))
    }

    const handleChange = e => setInputValue(e.detail.value)

    const changeValue = () => {
        if (inputValue.length > CARD_COUNT) {
            Taro.showToast({ icon: 'none', title: `最长 ${CARD_COUNT} 个字哦` })
            return false
        }
        const v = inputValue || DEFAULT_TEXT
        setValue(v)
        setSqual(makeCards(v))
    }

    const next = () => setSqual(makeCards(value))

    return (
        <View className='page game'>
            <View className='page-header'>
                <View className='icon-tile t-flop'>
                    <View className='mini-card'>
                        <View className='mini-card-inner'>?</View>
                    </View>
                </View>
                <View>
                    <View className='page-title'>文字翻牌</View>
                    <View className='page-sub'>把规则藏进 9 张牌里，翻到什么做什么</View>
                </View>
            </View>

            <View className='input-row'>
                <Input
                    className='input'
                    placeholder='请输入 1~9 个字，如：你死定了'
                    placeholderClass='input-ph'
                    maxLength={CARD_COUNT}
                    value={inputValue}
                    onInput={handleChange}
                    confirmType='done'
                    onConfirm={changeValue}
                />
                <View
                    className='input-action'
                    hoverClass='primary-btn-active'
                    onClick={changeValue}
                >
                    确定
                </View>
            </View>

            <View className='game-content'>
                {squal.map((element, index) => (
                    <View
                        key={element.key}
                        className='card-item'
                        hoverClass='card-item-active'
                        onClick={() => flop(index)}
                    >
                        <View
                            className={`face front${element.hasClick ? ' flipped' : ''}`}
                        >
                            <View className='face-shape'>
                                <View className='face-dot' />
                                <View className='face-dot' />
                                <View className='face-dot' />
                            </View>
                        </View>
                        <View
                            className={`face back${element.hasClick ? ' flipped' : ''}`}
                        >
                            {element.value || '空'}
                        </View>
                    </View>
                ))}
            </View>

            <View className='section-title'>玩法介绍</View>
            <View className='expain'>
                <View>自定义一段文字（1~9 个字），文字会随机打乱放进 9 张牌背面。</View>
                <View>例：输入“你死定了”，约定翻到“你”字喝一杯、“死”字喝一瓶。</View>
            </View>

            <View className='bottom-bar'>
                <View
                    className='ghost-btn'
                    hoverClass='primary-btn-active'
                    onClick={next}
                >
                    下一局（重新打乱）
                </View>
            </View>
        </View>
    )
}