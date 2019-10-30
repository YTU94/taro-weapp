import Taro, { useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo, useShareAppMessage } from "@tarojs/taro"
import { View } from "@tarojs/components"
import { AtList, AtListItem } from "taro-ui"
import "./index.less"

function Index({ initialCount }) {
    const lists = [
        { title: "apple id", note: "", path: "/pages/tabBar/account/msgCard/index", text: "", icon: "bookmark" },
        { title: "百度云账号", note: "", path: "/pages/tabBar/account/bdCloud/index", text: "", icon: "download-cloud" },
        { title: "迅雷账号", note: "", path: "/pages/tabBar/account/xunlei/index", text: "", icon: "download" }
    ]
    const go = e => {
        Taro.navigateTo({
            url: e.path
        })
    }

    useShareAppMessage(res => {
        return {
            title: "账号分享",
            path: "/pages/tabBar/account/index"
        }
    })

    return (
        <View className='account'>
            <View className='title'> 账号分享 </View>
            <AtList hasBorder={false}>
                {lists.map(e => {
                    return (
                        <AtListItem
                            onClick={go.bind(this, e)}
                            title={e.title}
                            note={e.note}
                            extraText={e.text}
                            arrow='right'
                            iconInfo={{ size: 25, color: "#6190E8", value: e.icon }}
                        />
                    )
                })}
            </AtList>
            <View className='adContainer'>
                <ad unit-id='adunit-49a1cea77858409e' />
            </View>
        </View>
    )
}

Index.config = {
    navigationBarTitleText: "分享"
}

export default Index
