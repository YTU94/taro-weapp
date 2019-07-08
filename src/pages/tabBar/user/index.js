import Taro, { Component } from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import { AtButton } from "taro-ui"

import "./index.less"
import http from "../../../api"
import CusInput from "../../../components/cusInput"

function timestampToTime(timestamp) {
    var date = new Date(timestamp)
    var Y = date.getFullYear()
    var M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    var D = date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate()
    var h = date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours()
    var m = date.getMinutes() < 10 ? "0" + date.getMinutes() + ":" : date.getMinutes()
    var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
    return `${Y}-${M}-${D} ${h}:${m}`
}

export default class Index extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config = {
        navigationBarTitleText: "我的"
    }
    constructor() {
        super(...arguments)
        this.state = {
            title: "留言板",
            userInfo: "",
            value: "",
            messageList: [
                {
                    message: "2323"
                }
            ],
            showInput: false
        }
    }

    componentWillMount() {
        this.init()
    }

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    init() {
        let that = this
        http({
            url: "/api/v1/messageList",
            data: {
                pageSize: 100,
                pageNum: 1
            }
        }).then(res => {
            that.setState({
                messageList: res.data
            })
        })
    }
    onGotUserInfo(e) {
        console.log(e.detail.userInfo)
        this.setState({
            showInput: true,
            userInfo: e.detail.userInfo
        })
    }

    onSubmit(v) {
        http({
            // host: "http://localhost:3001",
            url: "/api/v1/sendMessage",
            method: "post",
            data: {
                message: v,
                nickName: this.state.userInfo.nickName,
                address: `${this.state.userInfo.country} ${this.state.userInfo.province} ${this.state.userInfo.city}`
            }
        }).then(res => {
            console.log(res)
            this.init()
        })
    }

    onBlur() {
        this.setState({
            showInput: false
        })
    }

    render() {
        let topBar = (
            <View style='display:flex; justify-content:space-between;'>
                <AtButton
                    className='action-btn'
                    size='small'
                    type='secondary'
                    open-type='getUserInfo'
                    onGetUserInfo={this.onGotUserInfo.bind(this)}>
                    留言
                </AtButton>

                <AtButton className='action-btn' size='small' open-type='feedback'>
                    建议和反馈
                </AtButton>
            </View>
        )

        let msgList = this.state.messageList.map(e => {
            return (
                <View className='list-item' key={e.id}>
                    <View className='item-msg'>{e.message}</View>
                    <View className='item-footer'>
                        <View className='item-footer-right'>{e.nickName || "-"}</View>
                        <View className='item-footer-left'>{timestampToTime(e.createAt) || "-"}</View>
                    </View>
                </View>
            )
        })
        return (
            <View className='user'>
                {topBar}
                <View className='title'>
                    <View>{this.state.title}</View>
                </View>
                <View className='list-box'>{msgList}</View>
                {this.state.showInput && <CusInput show={showInput} onSubmit={this.onSubmit.bind(this)} onBlur={this.onBlur.bind(this)} />}
            </View>
        )
    }
}
