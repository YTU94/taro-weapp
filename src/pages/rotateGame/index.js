import Taro, { Component, Config } from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import "./index.less"
import { AtButton, AtModalContent, AtModal } from "taro-ui"

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

    constructor() {
        super(...arguments)
        this.state = {
            num: 1,
            gameStart: false,
            list: null
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

    select = e => {
        this.setState({
            isOpened: true,
            num: Math.floor(Math.random() * 54) + 1 || 1
        })
    }

    start = e => {
        console.log(e)
        this.setState({
            gameStart: true
        })
    }

    render() {
        // let rotateBox
        // if (this.state.showExpain) {
        const arr = this.state.list || [1, 2, 3, 4, 5, 6, 7, 8]
        const l = arr.length
        const rotateBox = arr.map((e, i) => (
            <View className='sector' style={`transform: rotate(${i * (360 / l)}deg)`}>
                <View class='sector-inner' style={`transform: translatex(-250rpx) rotate(${360 / l}deg)`}>
                    <span
                        style={`transform: rotate(-${360 / arr.length / 2}deg); width: ${Math.sin(
                            ((360 / arr.length / 2) * Math.PI) / 180
                        ).toFixed(2) * 160}%`}>
                        {e}
                    </span>
                </View>
            </View>
        ))

        // }
        return (
            <View className='puke-game'>
                <View className='title'> 随机选牌 </View>
                <AtButton className='puke-btn' type='primary' onClick={this.select}>
                    选牌
                </AtButton>
                <View className='rotate-box'>
                    <View
                        style={`transform: translate(-50%, 0) rotate(${this.state.gameStart ? getRandomInt(360, 1800) : 0}deg);`}
                        className='ani-rotate'>
                        {rotateBox}
                    </View>
                    <View className='rotate-pointer' onClick={this.start.bind(this)}>
                        开始
                    </View>
                </View>
            </View>
        )
    }
}
