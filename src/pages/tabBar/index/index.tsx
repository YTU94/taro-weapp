import Taro, { Component } from "@tarojs/taro"
import { View } from "@tarojs/components"
import { AtButton, AtGrid } from "taro-ui"

class Clock extends Component {
    constructor(props) {
        super(props)
        this.state = { date: new Date() }
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    tick() {
        this.setState({
            date: new Date()
        })
    }

    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        )
    }
}

export default class Index extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            title: "酒桌Gameing",
            list: ["1.二货", "2.来一个", "3.啥啥啥"]
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
        // dosth
        console.log(e)
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
    goPage = (e, index) => {
        console.log(e, index)
        Taro.navigateTo({
            url: e.url
        })
    }
    render() {
        return (
            <View className='home'>
                <View className='title'>{this.state.title}</View>

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
                        }
                    ]}
                />

                <View className='btn-group'>
                    <Clock />
                    <AtButton type='primary' className='add' onClick={this.add}>
                        赞赏👍
                    </AtButton>
                </View>
            </View>
        )
    }
}
