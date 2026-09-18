import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './index.less'

export default function Footer(props) {
    return (
        <View className='footer'>
            <AtButton onClick={props.onClick} className='footer-btn' type='primary'>
                添加{' '}
            </AtButton>{' '}
        </View>
    )
}
