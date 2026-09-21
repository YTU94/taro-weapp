import Taro from '@tarojs/taro'
import { View, Input, Text } from '@tarojs/components'
import { useState } from 'react'
import {
    useSession, addPlayer, removePlayer, toggleOut, newRound, totalCups
} from '../../utils/players'
import './index.less'

// 「今晚战况」入口 + 计分板弹层（方案 3.2-P0 玩家系统底座）
// fixed=true：游戏页右下角悬浮胶囊；fixed=false：首页内嵌战况卡
export default function PlayerBar({ fixed = false }) {
    const session = useSession()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')

    const players = session.players
    const cups = totalCups(players)
    const active = players.filter(p => !p.out).length

    const openBoard = () => setOpen(true)
    const closeBoard = () => setOpen(false)

    const onAdd = () => {
        const res = addPlayer(name)
        if (!res.ok) {
            Taro.showToast({ title: res.msg, icon: 'none', duration: 1200 })
            return
        }
        setName('')
    }

    return (
        <>
            {fixed ? (
                <View className='pb-fab' hoverClass='pb-fab-active' onClick={openBoard}>
                    <Text className='pb-fab-ico'>🍺</Text>
                    <View className='pb-fab-txt'>
                        <View className='pb-fab-title'>今晚战况</View>
                        <View className='pb-fab-sub'>
                            {players.length ? `${active} 人 · ${cups} 杯` : '还没加人'}
                        </View>
                    </View>
                    {!!players.length && <View className='pb-badge'>{players.length}</View>}
                </View>
            ) : (
                <View className='pb-inline card' onClick={openBoard}>
                    <View className='pb-inline-head'>
                        <View className='pb-inline-title'>今晚战况</View>
                        <View className='pb-inline-sub'>
                            {players.length
                                ? `${active} 人在场 · 已累计 ${cups} 杯`
                                : '点击添加玩家，罚酒自动记账'}
                        </View>
                    </View>
                    {players.length ? (
                        <View className='pb-chips'>
                            {players.slice(0, 6).map(p => (
                                <View key={p.id} className={`pb-chip${p.out ? ' pb-chip-out' : ''}`}>
                                    <View className='pb-chip-dot' style={{ background: p.color }} />
                                    {p.name}
                                    <Text className='pb-chip-cups'>{p.cups}杯</Text>
                                </View>
                            ))}
                            {players.length > 6 && (
                                <View className='pb-chip pb-chip-more'>+{players.length - 6}</View>
                            )}
                        </View>
                    ) : (
                        <View className='pb-empty-hint'>🍺 添加 2-12 位玩家，开始今晚的对抗</View>
                    )}
                </View>
            )}

            {open && (
                <View className='modal-overlay' onClick={closeBoard}>
                    <View className='pb-board' onClick={e => e.stopPropagation()}>
                        <View className='pb-board-title'>今晚战况</View>
                        <View className='pb-board-sub'>
                            {players.length
                                ? `共 ${players.length} 人 · 累计 ${cups} 杯`
                                : '先添加今晚的玩家，各游戏的罚酒会自动记到这里'}
                        </View>

                        <View className='pb-add'>
                            <Input
                                className='pb-add-input'
                                placeholder='玩家昵称（最多 8 字）'
                                maxlength={8}
                                value={name}
                                onInput={e => setName(e.detail.value)}
                            />
                            <View className='pb-add-btn' hoverClass='pb-fab-active' onClick={onAdd}>
                                添加
                            </View>
                        </View>

                        {!!players.length && (
                            <View className='pb-list'>
                                {players.map(p => (
                                    <View key={p.id} className={`pb-row${p.out ? ' pb-row-out' : ''}`}>
                                        <View className='pb-row-dot' style={{ background: p.color }} />
                                        <View className='pb-row-name'>{p.name}</View>
                                        {p.out && <View className='pb-row-tag'>已退出</View>}
                                        <View className='pb-row-cups'>
                                            {p.cups} 杯 · {p.times} 次
                                        </View>
                                        <View
                                            className='pb-row-act pb-row-outbtn'
                                            onClick={() => toggleOut(p.id)}
                                        >
                                            {p.out ? '回来' : '我好了'}
                                        </View>
                                        <View
                                            className='pb-row-act pb-row-del'
                                            onClick={() => removePlayer(p.id)}
                                        >
                                            删
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View className='pb-notice'>
                            理性饮酒 · 未成年人禁止饮酒 · 酒后不驾车
                        </View>

                        <View className='pb-board-btns'>
                            {!!players.length && (
                                <View
                                    className='pb-board-btn pb-board-ghost'
                                    hoverClass='pb-fab-active'
                                    onClick={() => {
                                        newRound()
                                        Taro.showToast({ title: '新的一局开始', icon: 'success' })
                                    }}
                                >
                                    开新的一局
                                </View>
                            )}
                            <View
                                className='pb-board-btn pb-board-primary'
                                hoverClass='pb-fab-active'
                                onClick={closeBoard}
                            >
                                关闭
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </>
    )
}
