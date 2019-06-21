import Taro, { Component, Config } from "@tarojs/taro"
import { View } from "@tarojs/components"
import "./index.less"
import { AtButton, AtInput } from "taro-ui"

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //不含最大值，含最小值
}

function dos(a: string, arr: []) {
    let sArr = a.split("")
    let insert = i => {
        let r = getRandomInt(0, arr.length)
        if (!arr[r].value) {
            console.log(r)
            arr[r].value = sArr[i]
        } else {
            insert(i)
        }
    }
    for (let i = 0; i < sArr.length; i++) {
        insert(i)
    }
}

export default class Index extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: "首页"
    }

    constructor() {
        super(...arguments)
        this.state = {
            value: "翻牌文字",
            inputValue: "",
            squal: [
                { key: "1", value: "", hasClick: false },
                { key: "2", value: "", hasClick: false },
                { key: "3", value: "", hasClick: false },
                { key: "4", value: "", hasClick: false },
                { key: "5", value: "", hasClick: false },
                { key: "6", value: "", hasClick: false },
                { key: "7", value: "", hasClick: false },
                { key: "8", value: "", hasClick: false },
                { key: "9", value: "", hasClick: false }
            ]
        }
    }
    componentWillMount() {
        dos(this.state.value, this.state.squal)
    }

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    flop = (e, index) => {
        let newSqual = this.state.squal.splice(0)
        newSqual[index].hasClick = true
        this.setState({
            squal: newSqual
        })
    }

    handleChange = e => {
        this.setState({
            inputValue: e
        })
    }

    changeValue = e => {
        if (this.state.inputValue.length > 8) {
            Taro.showToast({
                icon: "none",
                title: "最长9个字哦😯"
            })
            return false
        }
        this.setState(
            {
                value: this.state.inputValue
            },
            () => {
                this.next()
            }
        )
    }

    next = e => {
        const a = [
            { key: "1", value: "", hasClick: false },
            { key: "2", value: "", hasClick: false },
            { key: "3", value: "", hasClick: false },
            { key: "4", value: "", hasClick: false },
            { key: "5", value: "", hasClick: false },
            { key: "6", value: "", hasClick: false },
            { key: "7", value: "", hasClick: false },
            { key: "8", value: "", hasClick: false },
            { key: "9", value: "", hasClick: false }
        ]
        this.setState(
            {
                squal: a
            },
            () => {
                dos(this.state.value, this.state.squal)
            }
        )
    }

    render() {
        return (
            <View className='game'>
                <View className='title'>文字翻牌游戏</View>
                <View>
                    <AtInput
                        name=''
                        clear
                        border={false}
                        title='清除按钮'
                        placeholder='翻牌文字'
                        type='text'
                        value={this.state.inputValue}
                        onChange={this.handleChange.bind(this)}
                    >
                        <AtButton type='primary' size='small' onClick={this.changeValue}>
                            确定
                        </AtButton>
                    </AtInput>
                </View>

                <View className='game-content'>
                    {this.state.squal.map((element, index) => {
                        return (
                            <View
                                className={this.state.squal[index].hasClick ? "card-item animation-rotate" : "card-item"}
                                key={index}
                                onClick={this.flop.bind(this, element, index)}
                            >
                                {this.state.squal[index].hasClick ? element.value || "=^_^=" : index + 1}
                            </View>
                        )
                    })}
                </View>

                <View className='expain'>
                    游戏规则：自定义一段文字，这段文字会随即打乱在1-9的牌面下面，然后自定义翻到什么字的人，做什么样的惩罚！
                    例如：自定义文字输入：‘你死定了’，然后规则：翻到‘你’字的人喝一杯，翻到‘死’的人和一瓶。
                </View>
                <View className='footer'>
                    <AtButton type='primary' onClick={this.next}>
                        下一局
                    </AtButton>
                </View>
            </View>
        )
    }
}
