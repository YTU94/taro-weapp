import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useState } from 'react'
import { AtButton, AtInput } from 'taro-ui'
import './index.less'

const CARD_COUNT = 9
const DEFAULT_TEXT = '翻牌文字'

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //不含最大值，含最小值
}

/**
 * 生成 9 张牌，并把文字随机打乱填进牌面
 * 等价于原 dos() 的逻辑，去掉了递归写法，文字超过 9 个字时直接截断
 */
function makeCards(text) {
    const chars = String(text || '')
        .split('')
        .slice(0, CARD_COUNT)
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

    useShareAppMessage(() => {
        return {
            path: '/pages/tabBar/index/index'
        }
    })

    const flop = index => {
        setSqual(prev => prev.map((item, i) => (i === index ? { ...item, hasClick: true } : item)))
    }

    const handleChange = v => {
        setInputValue(v)
    }

    const changeValue = () => {
        if (inputValue.length > 8) {
            Taro.showToast({
                icon: 'none',
                title: '最长9个字哦😯'
            })
            return false
        }
        setValue(inputValue)
        setSqual(makeCards(inputValue))
    }

    const next = () => {
        setSqual(makeCards(value))
    }

    return (
        <View className='game'>
            <View className='title'> 文字翻牌游戏 </View>
            <View>
                <AtInput
                    name=''
                    clear
                    border={false}
                    title='文字'
                    placeholder='请输入翻牌文字'
                    type='text'
                    value={inputValue}
                    onChange={handleChange}
                >
                    <AtButton type='primary' size='small' onClick={changeValue}>
                        确定
                    </AtButton>
                </AtInput>
            </View>
            <View className='game-content'>
                {squal.map((element, index) => {
                    return (
                        <View
                            key={element.key}
                            style='position:relative;'
                            className='card-item'
                            onClick={() => flop(index)}
                        >
                            <View className={squal[index].hasClick ? 'front animation-rotate-f' : 'front'}> 🤔</View>
                            <View className={squal[index].hasClick ? 'back animation-rotate-b' : 'back'}>
                                {element.value || '😁'}
                            </View>
                        </View>
                    )
                })}
            </View>
            <View className='expain'>
                游戏规则： 自定义一段文字， 这段文字会随即打乱在1 - 9 的牌面下面，
                然后自定义翻到什么字的人， 做什么样的惩罚！ 例如： 自定义文字输入：‘ 你死定了’，
                然后规则： 翻到‘ 你’ 字的人喝一杯， 翻到‘ 死’ 的人和一瓶。
            </View>
            <View className='footer'>
                <AtButton type='primary' onClick={next}>
                    下一局
                </AtButton>
            </View>
        </View>
    )
}
