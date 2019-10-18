import Taro, { Component, Config } from "@tarojs/taro"
import { View, Text, Swiper, SwiperItem } from "@tarojs/components"
import { AtButton, AtDrawer, AtCheckbox, AtCard, AtInputNumber, AtInput, AtForm } from "taro-ui"

import "./index.less"
import "taro-ui/dist/style/components/drawer.scss"
import "taro-ui/dist/style/components/list.scss"

export default class Index extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    Config = {
        navigationBarTitleText: "keep清单"
    }
    constructor() {
        super()
        this.state = {
            value: 1,
            show: false,
            checkedList: ["list1"]
        }
    }
    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    add = e => {
        this.setState({
            show: true
        })
    }

    render() {
        return (
            <View className='footer'>
                <AtButton onClick={this.add.bind(this)} className='footer-btn' type='primary'>
                    添加{" "}
                </AtButton>{" "}
            </View>
        )
    }
}
