import Taro, { Component } from "@tarojs/taro"
import { View, Picker } from "@tarojs/components"
import "./index.less"
import { AtButton, AtIcon } from "taro-ui"

function randomNum(params) {
    return Math.ceil(Math.random() * params)
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
        navigationBarTitleText: "摇骰子"
    }

    constructor() {
        super(...arguments)
        this.state = {
            diceNum: 5,
            selector: [1, 2, 3, 4, 5, 6],
            diceList: [],
            showDice: false
        }
    }
    onShareAppMessage(res) {
        return {
            path: "/pages/tabBar/index/index"
        }
    }

    componentWillMount() {}

    componentDidMount() {
        const that = this

        Taro.onAccelerometerChange(function(e) {
            if (e.x > 0.6 || e.y > 0.6) {
                Taro.showToast({
                    title: "摇好啦👌",
                    icon: "success",
                    duration: 1000
                })
                that.init()
            }
        })
    }

    componentWillUnmount() {
        Taro.stopAccelerometer()
    }

    componentDidShow() {}

    componentDidHide() {}

    init = e => {
        let a = []
        for (let i = 0; i < this.state.diceNum; i++) {
            let v = randomNum(6)
            a.push(v)
        }
        this.setState({
            showDice: false,
            diceList: a
        })
    }

    onChange = e => {
        this.setState({
            diceNum: parseInt(e.detail.value) + 1
        })
    }
    openDice = e => {
        if (this.state.diceList.length > 0) {
            this.setState({
                showDice: true
            })
        } else {
            Taro.showToast({
                title: "请先摇一摇",
                icon: "none",
                duration: 1000
            })
        }
    }
    render() {
        const showDice = this.state.showDice
        const imgList = this.state.diceList.map(e => {
            return <image className='dice-img' src={`http://assets.ytuj.cn/img/dice/${e}.png`} alt='' mode='widthFix' />
        })

        return (
            <View className='dice-game'>
                <View className='dice-num'>
                    <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
                        <View className='dice-picker'>🎲 X {this.state.diceNum} <View className='at-icon at-icon-chevron-down'></View> </View>{" "}
                    </Picker>{" "}
                </View>
                <View className='title'> 骰子游戏 </View>
                <View className='dice-bg'>
                    <View className='dice-box'> {showDice && imgList} </View>
                    <image
                        className='dice-bg-img'
                        className={this.state.diceList.length > 0 ? "dice-bg-active" : ""}
                        src='http://assets.ytuj.cn/img/dice/dice-bg.png'
                        alt=''
                        mode='widthFix'
                    />
                    <View className='shake-text' type='primary' onClick={this.select}>
                        摇一摇 <image className='shake-img' src='http://assets.ytuj.cn/img/dice/shake_icon.png' alt='' mode='widthFix' />
                    </View>{" "}
                </View>
                <AtButton className='opt-btn' type='primary' onClick={this.openDice}>
                    开！！{" "}
                </AtButton>{" "}
            </View>
        )
    }
}
