import Taro, { useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo } from "@tarojs/taro"
import { View } from "@tarojs/components"
import http from "../../../../api"
import CountCard from "../../../../components/countCard"

function Index({ initialCount }) {
    const [idList, setidList] = useState([])

    useEffect(() => {
        Taro.showLoading()
        http({
            url: "/api/otherIdList"
        }).then(res => {
            Taro.hideLoading()
            const arr = res.data.filter(e => e.type === 1)
            setidList(spliceAccountList(arr))
        })
    }, [])

    const spliceAccountList = arr => {
        let a = []
        arr.forEach(e => {
            let accountArr = e.account.split(",")
            let pwdArr = e.password.split(",")
            if (accountArr.length == pwdArr.length) {
                accountArr.forEach((f, i) => {
                    a.push({
                        account: f,
                        name: e.name,
                        remark: e.remark,
                        password: pwdArr[i]
                    })
                })
            }
        })
        return a
    }
    return (
        <View className='account-list'>
            <CountCard idList={idList}></CountCard>
        </View>
    )
}

Index.config = {
    navigationBarTitleText: "百度云账号"
}

export default Index
