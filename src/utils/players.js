import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'

// 玩家系统与计分板底座（方案 3.2-P0）
// 数据仅存本地（Storage），不上传 —— 符合方案「数据合规」要求
const KEY = 'jb_session_v1'
export const MAX_PLAYERS = 12

const COLORS = [
    '#6190e8', '#7c6fe8', '#e8a23d', '#e2582f', '#3eb575',
    '#7a5af8', '#2f9ee2', '#d9668f', '#5a8f5c', '#b9770e',
    '#4a6fe3', '#c2504f'
]

function uid() {
    return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function createSession() {
    return { players: [], startedAt: Date.now(), history: [] }
}

let state = load()
const listeners = new Set()

function load() {
    try {
        const s = Taro.getStorageSync(KEY)
        if (s && Array.isArray(s.players)) return s
    } catch (e) { /* ignore */ }
    return createSession()
}

function persist() {
    try { Taro.setStorageSync(KEY, state) } catch (e) { /* ignore */ }
}

function emit() {
    listeners.forEach(l => l(state))
}

// React hook：页面订阅战况变化
export function useSession() {
    const [s, setS] = useState(state)
    useEffect(() => {
        listeners.add(setS)
        return () => { listeners.delete(setS) }
    }, [])
    return s
}

export function getSession() {
    return state
}

export function addPlayer(name) {
    const n = String(name || '').trim().slice(0, 8)
    if (!n) return { ok: false, msg: '先起个昵称' }
    if (state.players.length >= MAX_PLAYERS) return { ok: false, msg: `最多 ${MAX_PLAYERS} 人` }
    if (state.players.some(p => p.name === n)) return { ok: false, msg: '已有同名玩家' }
    state = {
        ...state,
        players: state.players.concat({
            id: uid(),
            name: n,
            cups: 0,   // 累计罚酒杯数
            times: 0,  // 被罚次数
            out: false, // 「我好了」退出本轮
            color: COLORS[state.players.length % COLORS.length]
        })
    }
    persist()
    emit()
    return { ok: true }
}

export function removePlayer(id) {
    state = { ...state, players: state.players.filter(p => p.id !== id) }
    persist()
    emit()
}

export function toggleOut(id) {
    state = {
        ...state,
        players: state.players.map(p => (p.id === id ? { ...p, out: !p.out } : p))
    }
    persist()
    emit()
}

// 记罚酒：ids 为玩家 id 数组；cups 支持小数（0.5 = 半杯）
export function punish({ ids = [], cups = 1, game = '', text = '' }) {
    const valid = ids.filter(id => state.players.some(p => p.id === id && !p.out))
    if (!valid.length || !cups) return false
    const set = new Set(valid)
    state = {
        ...state,
        players: state.players.map(p =>
            set.has(p.id) ? { ...p, cups: Math.round((p.cups + cups) * 10) / 10, times: p.times + 1 } : p
        ),
        history: [{ game, text, cups, ids: valid, at: Date.now() }]
            .concat(state.history)
            .slice(0, 50)
    }
    persist()
    emit()
    return true
}

export function clearHistory() {
    state = { ...state, history: [] }
    persist()
    emit()
}

// 开新的一局：清空杯数与历史，保留玩家名单
export function newRound() {
    state = {
        ...state,
        startedAt: Date.now(),
        history: [],
        players: state.players.map(p => ({ ...p, cups: 0, times: 0, out: false }))
    }
    persist()
    emit()
}

export function totalCups(players) {
    return players.reduce((sum, p) => sum + p.cups, 0)
}
