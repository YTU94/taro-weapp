import { useShareAppMessage } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useState } from 'react'
import { PUKE_IMAGES } from '../../utils/images'
import '../../styles/page-common.less'
import './index.less'

export default function Index() {
    const [num, setNum] = useState(1)
    const [drawing, setDrawing] = useState(false)

    useShareAppMessage(() => ({
        path: '/pages/tabBar/index/index'
    }))

    const select = () => {
        if (drawing) return
        setDrawing(true)
        // 先盖牌再换牌，营造"抽牌"节奏感
        setTimeout(() => {
            setNum(Math.floor(Math.random() * 54) + 1)
            setDrawing(false)
        }, 260)
    }

    return (
        <View className='page puke-game'>
            <View className='page-header'>
                <View className='icon-tile t-puke'>
                    <View className='mini-card c-red'>
                        <View className='mini-card-inner'>A</View>
                    </View>
                </View>
                <View>
                    <View className='page-title'>随机选牌</View>
                    <View className='page-sub'>抽一张牌，看看今晚谁"最小"</View>
                </View>
            </View>

            <View className='card preview' hoverClass='card-active' onClick={select}>
                <Image
                    className={`preview-img${drawing ? ' drawing' : ''}`}
                    src={PUKE_IMAGES[num]}
                    mode='widthFix'
                />
                <View className='preview-hint'>
                    {drawing ? '抽牌中…' : '点击卡片或下方按钮抽一张'}
                </View>
            </View>

            <View className='section-title'>玩法介绍</View>
            <View className='expain'>
                <View>玩法一：酒桌放一个空碗，每人选一张牌，不让别人看到；往碗里一直倒酒，谁心虚喊停就喝掉碗里的酒，没人喊停就倒满，最后牌面最小者喝。</View>
                <View>玩法二：酒桌放空碗，每人选一张牌给他人看，自己不能看，觉得桌上有比自己更小的牌就不喊停，直到酒满，最后比大小。</View>
            </View>

            <View className='bottom-bar'>
                <View
                    className={`primary-btn${drawing ? ' primary-btn-disabled' : ''}`}
                    hoverClass='primary-btn-active'
                    onClick={select}
                >
                    {drawing ? '抽牌中…' : '选一张牌'}
                </View>
            </View>
        </View>
    )
}