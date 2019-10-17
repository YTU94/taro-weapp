import Taro, { Component, useState } from "@tarojs/taro"
import { View } from "@tarojs/components"
import "./index.less"
import { AtButton } from "taro-ui"
import CusInput from "../../components/cusInput"

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //不含最大值，含最小值
}

export default class Index extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */

    constructor(props) {
        super(props)
        this.state = {
            num: 1,
            gameStart: false,
            list: null,
            cusList: [],
            showInput: false,
            btnDisabled: false
        }
    }
    onShareAppMessage(res) {
        return {
            path: "/pages/tabBar/index/index"
        }
    }
    config = {
        navigationBarTitleText: "转盘游戏"
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    start(e) {
        if (this.state.btnDisabled) return
        let that = this
        console.log("start")

        e.stopPropagation()

        this.setState(
            {
                num: this.state.num + getRandomInt(360, 1800),
                btnDisabled: true
            },
            () => {
                setTimeout(() => {
                    that.setState({
                        btnDisabled: false
                    })
                }, 5000)
            }
        )
    }

    clear(e) {
        console.log("clear")

        e.stopPropagation()
        this.setState({
            cusList: []
        })
    }
    onSubmit(v) {
        let a = this.state.cusList.slice(0)
        if (a.length > 10) {
            Taro.showToast({
                title: "最多支持10个自定义选项",
                icon: "none",
                duration: 1500
            })
            return false
        }
        if (!v) {
            Taro.showToast({
                title: "内容不能为空",
                icon: "none",
                duration: 1500
            })
            return false
        }
        a.push(v)
        this.setState({
            cusList: a
        })
        console.log(this.state.cusList)
    }

    blur = e => {
        this.setState({
            showInput: false
        })
    }

    showInputBox = e => {
        e.stopPropagation()
        if (this.state.showInput) return
        this.setState({
            showInput: true
        })
    }

    render() {
        const defaultList = ["PASS", "再来一次", "喝一杯", "讲故事", "喝一瓶", "喝半杯", "大冒险", "大家干杯", "选人喝一杯", "赢家说了算"]
        let arr = []
        if (10 > this.state.cusList.length > 0) {
            const cl = this.state.cusList.length
            arr = this.state.cusList.concat(defaultList.slice(cl))
        } else {
            arr = this.state.cusList.slice(0, 10)
        }
        const l = arr.length
        const rotateBox = arr.map((e, i) => (
            <View className='sector' style={`transform: rotate(${i * (360 / l)}deg)`}>
                <View class='sector-inner' style={`transform: translatex(-250rpx) rotate(${360 / l}deg)`}>
                    <span
                        style={`transform: translate(0, -100%) rotate(-${360 / arr.length / 2}deg); width: ${Math.sin(
                            ((360 / arr.length / 2) * Math.PI) / 180
                        ).toFixed(8) * 160}%`}>
                        {e}
                    </span>
                </View>
            </View>
        ))

        // }
        return (
            <View className='rotate-game'>
                <View className='title'> 超级转盘 </View>
                <View style='display:flex; justify-content:space-between;padding: 10rpx 40rpx;box'>
                    <View onClick={this.showInputBox.bind(this)}>
                        <AtButton className='cus-btn' size='small' type='secondary'>
                            自定义转盘
                        </AtButton>
                    </View>

                    <View onClick={this.clear.bind(this)}>
                        <AtButton className='cus-btn' size='small' onClick={this.clear.bind(this)}>
                            清空
                        </AtButton>
                    </View>
                </View>

                <View className='rotate-box'>
                    <View style={`transform: translate(-50%, 0) rotate(${this.state.num}deg);`} className='ani-rotate'>
                        {rotateBox}
                    </View>
                    <View className='rotate-pointer'>结果</View>
                </View>

                {this.state.showInput ? (
                    <CusInput show={showInput} onSubmit={this.onSubmit.bind(this)} onBlur={this.blur.bind(this)} />
                ) : (
                    <AtButton className='action-btn' type='primary' disabled={btnDisabled} onClick={this.start.bind(this)}>
                        开始
                    </AtButton>
                )}
            </View>
        )
    }
}
