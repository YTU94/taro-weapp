import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import { Die } from '../../components/faces'
import PlayerBar from '../../components/playerBar'
import { useSession, punish } from '../../utils/players'
import '../../styles/page-common.less'
import './index.less'

const DICE_NUM_LIST = [1, 2, 3, 4, 5, 6]
const MODES = [
    { key: 'free', name: '自由摇骰' },
    { key: '789', name: '789' }
]

function randomNum(n) {
    return Math.ceil(Math.random() * n)
}

// 789 判定：两骰之和 —— 7 加酒 / 8 半杯 / 9 全杯 / 其余过
function judge789(sum) {
    if (sum === 7) return { kind: 'add', label: '加酒！往公杯里加酒', cups: 0 }
    if (sum === 8) return { kind: 'half', label: '喝半杯', cups: 0.5 }
    if (sum === 9) return { kind: 'full', label: '喝全杯', cups: 1 }
    return { kind: 'pass', label: '安全过', cups: 0 }
}

export default function Index() {
    const [mode, setMode] = useState('free')
    const [diceNum, setDiceNum] = useState(5)
    const [diceList, setDiceList] = useState([])
    const [rolling, setRolling] = useState(false)
    const [opened, setOpened] = useState(false)
    const [result789, setResult789] = useState(null)

    const session = useSession()
    const activePlayers = session.players.filter(p => !p.out)

    useShareAppMessage(() => ({
        path: '/pages/tabBar/index/index'
    }))

    const vibrate = () => {
        try { Taro.vibrateShort({}) } catch (e) { /* ignore */ }
    }

    const roll = () => {
        if (rolling) return
        vibrate()
        setRolling(true)
        setOpened(false)
        setResult789(null)

        const count = mode === '789' ? 2 : diceNum
        const list = Array.from({ length: count }, () => randomNum(6))
        // 杯子先摇 600ms 再开盅
        setTimeout(() => {
            vibrate()
            setDiceList(list)
            setOpened(true)
            setRolling(false)
            if (mode === '789') {
                const sum = list[0] + list[1]
                setResult789({ sum, ...judge789(sum) })
            }
        }, 600)
    }

    // 摇一摇：把最新 roll 放进 ref，避免加速度监听闭包读到旧状态
    const rollRef = useRef(roll)
    rollRef.current = roll

    useEffect(() => {
        Taro.startAccelerometer({ interval: 'game' })
        let last = 0
        const onChange = e => {
            if (e.x > 0.6 || e.y > 0.6) {
                const now = Date.now()
                if (now - last < 1500) return // 防连摇
                last = now
                rollRef.current()
            }
        }
        Taro.onAccelerometerChange(onChange)
        return () => {
            try { Taro.stopAccelerometer({}) } catch (e) { /* ignore */ }
        }
    }, [])

    const switchMode = m => {
        if (m === mode) return
        setMode(m)
        setDiceList([])
        setOpened(false)
        setRolling(false)
        setResult789(null)
    }

    const onChange = e => setDiceNum(parseInt(e.detail.value) + 1)

    const record = (p, cups) => {
        const ok = punish({
            ids: [p.id],
            cups,
            game: '789',
            text: `${result789.sum} 点 · ${result789.label}`
        })
        if (ok) {
            vibrate()
            Taro.showToast({ title: `已记 ${p.name} ${cups} 杯`, icon: 'none', duration: 1200 })
        }
    }

    const stageHint = rolling
        ? '摇骰中…'
        : opened
            ? (mode === '789' ? result789?.label || '' : `${diceList.length} 颗 · 再摇换一批`)
            : '摇一摇或点击开始'

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
                    <View className='page-sub'>
                        {mode === '789' ? '7 加酒 · 8 半杯 · 9 全杯，自动判罚' : '选好数量，摇一摇，开骰盅'}
                    </View>
                </View>
            </View>

            <View className='card dice-card'>
                <View className='seg'>
                    {MODES.map(m => (
                        <View
                            key={m.key}
                            className={`seg-item${mode === m.key ? ' seg-item-active' : ''}`}
                            onClick={() => switchMode(m.key)}
                        >
                            {m.name}
                        </View>
                    ))}
                </View>

                {mode === 'free' && (
                    <View className='dice-card-header'>
                        <View className='dice-card-label'>骰子数量</View>
                        <Picker mode='selector' range={DICE_NUM_LIST} onChange={onChange}>
                            <View className='dice-picker'>
                                <Text className='dice-picker-num'>{diceNum}</Text>
                                <View className='dice-picker-caret' />
                            </View>
                        </Picker>
                    </View>
                )}

                <View className='dice-stage'>
                    {/* 骰子（桌面层） */}
                    <View className='dice-zone'>
                        {opened &&
                            diceList.map((v, i) => (
                                <Die
                                    key={`${v}-${i}`}
                                    value={v}
                                    small={mode === 'free' && diceList.length > 4}
                                    delay={i * 70}
                                />
                            ))}
                        {mode === '789' && opened && (
                            <View className='sum-badge'>{result789?.sum} 点</View>
                        )}
                    </View>
                    {/* 立体骰盅（盖在骰子上方，开盅飞出） */}
                    <View className={`cup${opened ? ' cup-opened' : ''}${rolling ? ' cup-shaking' : ''}`}>
                        <View className='cup-body'>
                            <View className='cup-band' />
                        </View>
                        <View className='cup-shadow' />
                    </View>
                </View>

                <View className='shake-text' onClick={roll}>{stageHint}</View>

                {mode === '789' && result789 && (
                    <View className={`judge judge-${result789.kind}`}>
                        <Text className='judge-txt'>{result789.label}</Text>
                        {result789.cups > 0 && (
                            <View className='judge-assign'>
                                {activePlayers.length ? (
                                    <View className='judge-chips'>
                                        <View className='judge-assign-label'>记给谁：</View>
                                        {activePlayers.map(p => (
                                            <View
                                                key={p.id}
                                                className='judge-chip'
                                                hoverClass='judge-chip-active'
                                                onClick={() => record(p, result789.cups)}
                                            >
                                                {p.name} +{result789.cups}杯
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <View className='judge-assign-hint'>
                                        在首页「今晚战况」添加玩家，罚酒自动记账
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                )}
            </View>

            <View className='bottom-bar'>
                <View
                    className={`primary-btn${rolling ? ' primary-btn-disabled' : ''}`}
                    hoverClass='primary-btn-active'
                    onClick={roll}
                >
                    {rolling ? '摇骰中…' : mode === '789' ? '摇一盅' : '摇！'}
                </View>
            </View>

            <PlayerBar fixed />
        </View>
    )
}
