import { useShareAppMessage } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { AtButton, AtModalContent, AtModal } from 'taro-ui'
import { PUKE_IMAGES } from '../../utils/images'
import './index.less'

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //不含最大值，含最小值
}

function selectNum() {
    const arr = []
    while (arr.length < 3) {
        const i = getRandomInt(1, 55)
        if (!arr.includes(i)) {
            arr.push(i)
        }
    }
    return arr
}

export default function Index() {
    const [isOpened, setIsOpened] = useState(false)
    const [numArr, setNumArr] = useState([])

    useShareAppMessage(() => {
        return {
            title: '24点',
            path: '/pages/tabBar/index/index'
        }
    })

    useEffect(() => {
        if (!isOpened) return
        setNumArr(selectNum())
    }, [isOpened])

    const start = () => {
        setIsOpened(true)
    }

    const handleClose = () => {
        setIsOpened(false)
    }

    return (
        <View className='twentyFour-game'>
            <View className='title'>24点</View>
            <AtButton className='puke-btn' type='primary' onClick={start}>
                开始
            </AtButton>

            <View className='expain'>
                <View className='explain-label'>🎮玩法介绍：</View>
                <View style='text-align:left;'>看谁最快利用➕➖✖️➗将3张扑克牌计算出24。</View>
            </View>

            <AtModal isOpened={isOpened} onClose={handleClose} closeOnClickOverlay>
                <AtModalContent>
                    <View className='imgBox'>
                        {numArr.map(e => {
                            return (
                                <Image
                                    key={e}
                                    className='puke-img'
                                    src={PUKE_IMAGES[e]}
                                    mode='widthFix'
                                    style='width:100%;margin:200rpx 5rpx;'
                                />
                            )
                        })}
                    </View>
                </AtModalContent>
            </AtModal>
        </View>
    )
}
