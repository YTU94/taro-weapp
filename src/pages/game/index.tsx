import Taro, { Component, Config } from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import "./index.less"
import { AtButton, AtInput } from "taro-ui"
import { func } from "prop-types"

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //不含最大值，含最小值
}
function dos(a: string, arr: Array) {
    let nArr = arr.slice(0)
    let sArr = a.split("")
    let n = []
    for (let i = 0; i < sArr.length; i++) {
        let r = getRandomInt(0, nArr.length)
        console.log(r, sArr[i], nArr[r])
        try {
            nArr[r].value = sArr[i]
        } catch (error) {
            console.log(error)
        }
        n.push(nArr[r])
        nArr.splice(r, 1)
    }
    arr.forEach(e => {
        n.forEach(f => {
            if (e.key === f.key) {
                e = f
            }
        })
    })
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
            number: 5,
            value: "你死定了",
            value4: "",
            squal: [
                { key: "1", value: "" },
                { key: "2", value: "" },
                { key: "3", value: "" },
                { key: "4", value: "" },
                { key: "5", value: "" },
                { key: "6", value: "" },
                { key: "7", value: "" },
                { key: "8", value: "" },
                { key: "9", value: "" }
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
        newSqual[index].key = e.value || "=^_^="
        this.setState({
            squal: newSqual
        })
        console.log(this.state.squal[index])
    }

    handleChange = e => {
        console.log(e)
        this.setState({
            value4: e
        })
    }

    changeValue = e => {
        console.log(e)
        if (this.state.value4.length > 8) {
            wx.showToast({
                icon: "none",
                title: "no no no"
            })
            return false
        }
        this.setState(
            {
                value: this.state.value4
            },
            () => {
                this.next()
            }
        )
    }

    next = e => {
        const a = [
            { key: "1", value: "" },
            { key: "2", value: "" },
            { key: "3", value: "" },
            { key: "4", value: "" },
            { key: "5", value: "" },
            { key: "6", value: "" },
            { key: "7", value: "" },
            { key: "8", value: "" },
            { key: "9", value: "" }
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
                        clear
                        border={false}
                        title='清除按钮'
                        placeholder='翻牌文字'
                        type='text'
                        value={this.state.value4}
                        onChange={this.handleChange.bind(this)}
                    >
                        <AtButton type='primary' size='small' onClick={this.changeValue}>
                            确定
                        </AtButton>
                    </AtInput>
                </View>

                <View className='' style='display:flex;flex-wrap: wrap;align-item:center;justify-content:center;'>
                    {this.state.squal.map((element, index) => {
                        return (
                            <View
                                className=''
                                key={index}
                                onClick={this.flop.bind(this, element, index)}
                                style='flex: 0 0 33%; height: 5em; line-height:5em; text-align:center;border:1px solid #eee; box-sizing:border-box;'
                            >
                                {element.key}
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
