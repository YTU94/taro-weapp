import Taro, { useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo } from "@tarojs/taro"
import { View } from "@tarojs/components"
import http from "../../../../api"
import "../msgCard/index.less"

export default function Counter({ initialCount }) {
    const [idList, setidList] = useState(initialCount)

    useEffect(() => {
        Taro.showLoading()
        http({
            url: "/api/otherIdList"
        }).then(res => {
            Taro.hideLoading()
            const arr = res.data.filter(e => e.type === 1)
            setidList(arr)
        })
    }, [])

    const copyAccount = e => {
        wx.setClipboardData({
            data: e.account,
            success(res) {
                Taro.showToast({
                    icon: "none",
                    title: "复制成功"
                })
            }
        })
    }

    const copyPassword = e => {
        wx.setClipboardData({
            data: e.password,
            success(res) {
                Taro.showToast({
                    icon: "none",
                    title: "复制成功"
                })
            }
        })
    }

    return (
        <View className='account-list'>
            {idList.map(card => {
                return (
                    <View className='card-list-item'>
                        <View className='card-title'>{card.name}</View>
                        <View className='card-item'>
                            <View className='card-label'>账号：</View>
                            <View className='card-content' onClick={copyAccount.bind(this, card)}>
                                {card.account}
                            </View>
                        </View>
                        <View className='card-item'>
                            <View className='card-label'>密码：</View>
                            <View className='card-content' onClick={copyPassword.bind(this, card)}>
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
