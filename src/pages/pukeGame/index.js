import { useShareAppMessage } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useState } from 'react'
import { AtButton, AtModalContent, AtModal } from 'taro-ui'
import { PUKE_IMAGES } from '../../utils/images'
import './index.less'

export default function Index() {
    const [num, setNum] = useState(1)
    const [isOpened, setIsOpened] = useState(false)

    useShareAppMessage(() => {
        return {
            path: '/pages/tabBar/index/index'
        }
    })

    const select = () => {
        setIsOpened(true)
        setNum(Math.floor(Math.random() * 54) + 1 || 1)
    }

    const closeModal = () => {
        setIsOpened(false)
    }

    return (
        <View className='puke-game'>
            <View className='puke-game-c'>
                <View className='title'> 随机选牌 </View>
                <AtButton className='puke-btn' type='primary' onClick={select}>
                    选牌
                </AtButton>
                <View className='expain'>
                    <View className='explain-label'>🎮玩法介绍：</View>
                    <View style='text-align:left;'>
                        玩法一： 酒桌方一个空碗， 每人选一张牌， 不要被别人看到， 然后往碗里一直倒酒， 如果有人心虚，
                        就喊停， 喊停的人就要喝掉碗里的酒， 没人喊停就倒满， 然后牌面最小的人喝酒。{' '}
                    </View>
                    <View style='text-align:left;'>
                        玩法二： 酒桌方一个空碗， 每人选一张牌， 注意自己不可看这个牌， 需要把牌给其他人看，
                        然后同上， 你觉得桌上有比你小的牌， 就不喊停， 直到酒满， 最后比大小。{' '}
                    </View>
                </View>
            </View>

            <AtModal isOpened={isOpened} onClose={closeModal} closeOnClickOverlay>
                <AtModalContent>
                    <Image className='puke-img' src={PUKE_IMAGES[num]} mode='widthFix' style='width:100%;' />
                </AtModalContent>
            </AtModal>
        </View>
    )
}
