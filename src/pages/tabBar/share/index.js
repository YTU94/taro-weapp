import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Ad } from '@tarojs/components'
import './index.less'

export default function Index() {
    useShareAppMessage(() => {
        return {
            title: '账号分享',
            path: '/pages/tabBar/share/index'
        }
    })

    return (
        <View className='account'>
            <View className='title'>分享给你的朋友</View>
            <View className='content'>点击右上角选择转发分享给你的朋友</View>
            <View className='footer-tip'>
                问题或者建议请发送邮件致ytu_94@163.com，您的反馈是我们前进的动力。
            </View>
            <View className='adContainer'>
                <Ad unitId='adunit-49a1cea77858409e' />
            </View>
        </View>
    )
}
