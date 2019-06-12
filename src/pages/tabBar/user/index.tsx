import Taro, { Component, Config } from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import { AtButton } from "taro-ui"

import "./index.less"

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
            title: "酒桌Gameing"
        }
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    render() {
        return (
            <View className='user'>
                <View className='title'>{this.state.title}</View>

                <AtButton className="action-btn" type='primary' open-type='feedback'>
                    建议和反馈
                </AtButton>
                <View className='' />
            </View>
        )
    }
}
