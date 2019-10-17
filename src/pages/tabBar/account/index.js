import Taro, { useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo } from "@tarojs/taro"
import { View } from "@tarojs/components"
import { AtList, AtListItem } from "taro-ui"

export default function Counter({ initialCount }) {
    const [count, setCount] = useState(initialCount)
    return (
        <View>
            <AtList>
                <AtListItem title='标题文字' note='描述信息' arrow='right' iconInfo={{ size: 25, color: "#78A4FA", value: "calendar" }} />
                <AtListItem
                    title='标题文字'
                    note='描述信息'
                    extraText='详细信息'
                    arrow='right'
                    iconInfo={{ size: 25, color: "#FF4949", value: "bookmark" }}
                />
            </AtList>
        </View>
    )
}
