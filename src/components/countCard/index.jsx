import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import './index.less'

function slicePwd(pwd) {
    if (!pwd) return ''
    const len = pwd.indexOf(':')
    return pwd.substr(len + 1)
}

export default function CountCard(props) {
    const [idList, setIdList] = useState([])

    useEffect(() => {
        setIdList(props.idList || [])
    }, [props.idList])

    const copy = data => {
        Taro.setClipboardData({
            data,
            success() {
                Taro.showToast({
                    icon: 'none',
                    title: '复制成功'
                })
            }
        })
    }

    return (
        <View className='account-card-list'>
            {idList.map((card, index) => {
                return (
                    <View key={card.id || card.account || index} className='card-list-item'>
                        <View className='card-title'>{card.name}</View>
                        <View className='card-item'>
                            <View className='card-label'>账号：</View>
                            <View className='card-content' onClick={() => copy(card.account)}>
                                {card.account}
                            </View>
                        </View>
                        <View className='card-item'>
                            <View className='card-label'>密码：</View>
                            <View className='card-content' onClick={() => copy(slicePwd(card.password))}>
                                点我复制
                            </View>
                        </View>
                        <View className='card-item'>
                            <View className='card-label'>备注：</View>
                            <View className='card-content red'>{card.remark}</View>
                        </View>
                    </View>
                )
            })}
        </View>
    )
}
