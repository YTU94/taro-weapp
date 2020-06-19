import Taro, { useState, useEffect, useShareAppMessage } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtGrid, AtNoticebar } from "taro-ui";
import "./index.less";
function Index(params) {
    const [state, setstate] = useState(false);
    const [title, settitle] = useState("taroGameing");
    const openPage = e => {
        e.url &&
            Taro.navigateTo({
                url: e.url
            });
    };
    const praise = e => {
        Taro.navigateToMiniProgram({
            appId: "wx18a2ac992306a5a4",
            path: "pages/apps/largess/detail?accountId=5686224",
            envVersion: "release",
            success(res) {}
        });
    };
    const cardList = [
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
            value: "2400点"
        },
        {
            url: "/pages/undercoverGame/index",
            image:
                "https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png",
            value: "谁是卧底"
        }
    ];
    return (
        <View>
            <View>
                <AtNoticebar close={true} single={true}>
                    // 点击右上角「···」-「添加到我的小程序」,下次访问更便捷 //
                </AtNoticebar>
                <View className="title"> {title} </View>
            </View>
            <AtGrid onClick={openPage} hasBorder={false} data={cardList} />
            <View className="btn-group">
                <AtButton type="primary" className="praise" onClick={praise}>
                    赞赏👍
                </AtButton>
            </View>
        </View>
    );
}

Index.config = {
    navigationBarTitleText: "首页"
};

export default Index;
