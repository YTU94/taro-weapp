import Taro, { Component, Config } from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import "./index.less"
import { AtButton, AtModalHeader, AtModalContent, AtModalAction, AtCard, AtModal } from "taro-ui"

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
            title: "Ytu",
            num: 1,
            isOpened: false
        }
    }

    config: Config = {
        navigationBarTitleText: "扑克牌"
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    goPage = (e, index) => {
        console.log(e, index)
        // Taro.navigateTo({
        //     url: "/pages/joinAction/index"
        // })
    }

    select = e => {
        console.log(e)
        this.setState({
            isOpened: true,
            num: Math.floor(Math.random() * 54) + 1 || 1
        })
    }
    handleClose = e => {
        console.log(e)
        this.setState({
            isOpened: false
        })
    }
    handleCancel = e => {
        console.log(e)
        this.setState({
            isOpened: false
        })
    }
    handleConfirm = e => {
        console.log(e)
        this.setState({
            isOpened: false
        })
    }

    render() {
        return (
            <View className='puke-game'>
                <View className='title'>随机选牌</View>

                <AtButton className='puke-btn' type='primary' onClick={this.select}>
                    选牌
                </AtButton>

                <View className='expain'>规则：玩家随机选择一张牌，然后后面的游戏规则完全可以由玩家自己子定义了。</View>
                <AtModal isOpened={this.state.isOpened}>
                    <AtModalContent>
                        <image
                            className='puke-img'
                            src={`http://assets.ytuj.cn/img/pukeImage/${this.state.num}.jpg`}
                            alt='loading'
                            style='width:100%;'
                            mode='widthFix'
                        />
                    </AtModalContent>
                </AtModal>
            </View>
        )
    }
}
