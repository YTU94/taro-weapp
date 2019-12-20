import Taro, { useShareAppMessage } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtList, AtListItem } from "taro-ui";
import "./index.less";

function Index() {
    const lists = [
        {
            title: "apple id",
            note: "",
            path: "/pages/tabBar/share/appleId/index",
            text: "",
            icon: "bookmark"
        }
        // { title: "百度云账号", note: "", path: "/pages/tabBar/share/bdCloud/index", text: "", icon: "download-cloud" },
        // { title: "迅雷账号", note: "", path: "/pages/tabBar/share/xunlei/index", text: "", icon: "download" }
    ];
    const openPage = e => {
        Taro.navigateTo({
            url: e.path
        });
    };

    useShareAppMessage(res => {
        return {
            title: "账号分享",
            path: "/pages/tabBar/share/index"
        };
    });

    return (
        <View className="account">
            <View className="title">
                分享给你的朋友
            </View>
            <View className="content">
                点击右上角选择转发分享给你的朋友
            </View>
            <View className="adContainer">
                <ad unit-id="adunit-49a1cea77858409e" />
            </View>
        </View>
    );
}

Index.config = {
    navigationBarTitleText: "分享"
};

export default Index;
