import Taro, {Component} from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtButton, AtGrid} from "taro-ui"

export default class Index extends Component {
    config = {
        navigationBarTitleText: "我的"
    }
    constructor() {
        super(...arguments)
        this.state = {
            title: "酒桌Gameing"
        }
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUpdate(nextProps, nextState) {}

    componentDidUpdate(prevProps, prevState) {}

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    add = e => {
        Taro.navigateToMiniProgram({
            appId: "wx18a2ac992306a5a4",
            path: "pages/apps/largess/detail?accountId=5686224",
            envVersion: "release",
            success(res) {
                // 打开成功
                console.log(res)
            }
        })
    }
    goPage = e => {
        if (e.url) {
            Taro.navigateTo({
                url: e.url
            })
        }
    }

    render() {
        return (
            <View className='home'>
                <View className='title'> {this.state.title} </View>{" "}
                <AtGrid
                    onClick={this.goPage}
                    data={[
                        {
                            url: "/pages/keepList/index",
                            image: "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png",
                            value: "keep清单"
                        },
                        {
                            url: "/pages/pukeGame/index",
                            image:
                                "https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png",
                            value: "扑克牌"
                        },
                        {
                            url: "/pages/game/index",
                            image: "https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png",
                            value: "翻牌游戏"
                        },
                        {
                            url: "/pages/diceGame/index",
                            image: "https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png",
                            value: "骰子游戏"
                        },
                        {
                            url: "",
                            image:
                                "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png",
                            value: "敬请期待"
                        }
                    ]}
                />{" "}
                <View className='btn-group'>
                    <AtButton type='primary' className='add' onClick={this.add}>
                        赞赏👍{" "}
                    </AtButton>{" "}
                </View>{" "}
            </View>
        )
    }
}
