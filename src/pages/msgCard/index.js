import Taro, { Component } from "@tarojs/taro"
import { View } from "@tarojs/components"

import "./index.less"
import http from "../../api"

let videoAd = null

export default class Index extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config = {
        navigationBarTitleText: "apple Id"
    }
    constructor() {
        super(...arguments)
        this.state = {
            curPwd: "",
            appleIdList: []
        }
    }
    onShareAppMessage(res) {
        return {
            path: "/pages/tabBar/index/index"
        }
    }
    componentWillMount() {
        this.init()
    }

    componentDidMount() {
        let that = this
        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId: "adunit-02b66ef80b3f8e73"
            })

            videoAd.onLoad(() => {
                console.log("onLoad event emit")
            })
            videoAd.onError(err => {
                console.log("onError event emit", err)
            })
            videoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                if (res && res.isEnded) {
                    console.log("正常播放结束，可以下发游戏奖励")
                    // 正常播放结束，可以下发游戏奖励
                    wx.setClipboardData({
                        data: that.state.curPwd,
                        success(res) {
                            wx.getClipboardData({
                                success(res) {}
                            })
                        }
                    })
                } else {
                    console.log("播放中途退出，不下发游戏奖励")
                    // 播放中途退出，不下发游戏奖励
                }
            })
        }
    }

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    init = e => {
        Taro.showLoading()
        http({
            url: "/api/appleidList"
        }).then(res => {
            Taro.hideLoading()
            this.setState({
                appleIdList: res.data
            })
        })
    }

    copyPassword(e) {
        this.setState(
            {
                curPwd: e.password
            },
            () => {
                videoAd.show().catch(err => console.log(err))
            }
        )
    }

    render() {
        const appleIdList = this.state.appleIdList
        const listItems = appleIdList.map(card => {
            return (
                <View className='card-list-item'>
                    <View className='card-title'>{card.name}</View>
                    <View className='card-item'>
                        <View className='card-label'>账号：</View>
                        <View className='card-content'>{card.account}</View>
                    </View>
                    <View className='card-item'>
                        <View className='card-label'>密码：</View>
                        <View className='card-content' onClick={this.copyPassword.bind(this, card)}>
                            点我复制
                        </View>
                    </View>
                    <View className='card-item'>
                        <View className='card-label'>备注：</View>
                        <View className='card-content red'>{card.remark}</View>
                    </View>
                </View>
            )
        })
        return <View className='account-list'>{listItems}</View>
    }
}
