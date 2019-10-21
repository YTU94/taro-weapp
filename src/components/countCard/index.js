import Taro, { useEffect, useContext, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo } from "@tarojs/taro"
import { View } from "@tarojs/components"
import "./index.less"

function CountCard(props) {
    const [idList, setidList] = useState([])

    useEffect(() => {
        setidList(props.idList)
    }, [props.idList])

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
        <View className='account-card-list'>
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

export default CountCard
