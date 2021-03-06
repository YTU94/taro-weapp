import Taro, { Component, Config } from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import "./index.less"
import { AtButton, AtModalContent, AtModal } from "taro-ui"

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
            showExpain: false,
            isOpened: false
        }
    }
    onShareAppMessage(res) {
        return {
            path: "/pages/tabBar/index/index"
        }
    }
    config = {
        navigationBarTitleText: "扑克牌"
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

    showExpainModal = e => {
        this.setState({
            showExpain: !this.state.showExpain
        })
    }

    render() {
        return (
            <View className='puke-game'>
                <View className='puke-game-c'>
                    <View className='title'> 随机选牌 </View>
                    <AtButton className='puke-btn' type='primary' onClick={this.select}>
                        选牌
                    </AtButton>
                    <View className='expain'>
                        <View className='explain-label' type='secondary' size='small' onClick={this.showExpainModal}>
                            🎮玩法介绍：
                        </View>
                        <View style='text-align:left;'>
                            玩法一： 酒桌方一个空碗， 每人选一张牌， 不要被别人看到， 然后往碗里一直倒酒， 如果有人心虚， 就喊停，
                            喊停的人就要喝掉碗里的酒， 没人喊停就倒满， 然后牌面最小的人喝酒。{" "}
                        </View>
                        <View style='text-align:left;'>
                            玩法二： 酒桌方一个空碗， 每人选一张牌， 注意自己不可看这个牌， 需要把牌给其他人看， 然后同上，
                            你觉得桌上有比你小的牌， 就不喊停， 直到酒满， 最后比大小。{" "}
                        </View>
                    </View>
                </View>

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
