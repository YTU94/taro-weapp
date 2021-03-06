import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtGrid, AtNoticebar } from "taro-ui";
import "./index.less";
export default class Index extends Component {
    config = {
        navigationBarTitleText: "首页"
    };

    constructor() {
        super(...arguments);
        this.state = {
            title: "酒桌Gameing",
            cardList: [
                {
                    url: "/pages/pukeGame/index",
                    image:
                        "https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png",
                    value: "扑克牌"
                },
                {
                    url: "/pages/flopGame/index",
                    image:
                        "https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png",
                    value: "文字翻牌"
                },
                {
                    url: "/pages/diceGame/index",
                    image:
                        "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png",
                    value: "摇色子"
                },
                {
                    url: "/pages/rotateGame/index",
                    image:
                        "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png",
                    value: "大转盘"
                },
                {
                    url: "/pages/twentyFourGame/index",
                    image:
                        "https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png",
                    value: "24点"
                }
            ]
        };
    }
    onShareAppMessage(res) {
        return {
            path: "/pages/tabBar/index/index"
        };
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUpdate(nextProps, nextState) {}

    componentDidUpdate(prevProps, prevState) {}

    shouldComponentUpdate(nextProps, nextState) {}

    praise = e => {
        Taro.navigateToMiniProgram({
            appId: "wx18a2ac992306a5a4",
            path: "pages/apps/largess/detail?accountId=5686224",
            envVersion: "release",
            success(res) {}
        });
    };
    openPage = e => {
        e.url &&
            Taro.navigateTo({
                url: e.url
            });
    };

    render() {
        return (
            <View className="home">
                <AtNoticebar close={true} single={true}>
                    点击右上角「···」-「添加到我的小程序」,下次访问更便捷
                </AtNoticebar>
                <View className="title"> {this.state.title} </View>{" "}
                <AtGrid
                    onClick={this.openPage}
                    hasBorder={false}
                    data={this.state.cardList}
                />{" "}
                <View className="btn-group">
                    <AtButton
                        type="primary"
                        className="praise"
                        onClick={this.praise}
                    >
                        赞赏👍{" "}
                    </AtButton>
                </View>
            </View>
        );
    }
}
