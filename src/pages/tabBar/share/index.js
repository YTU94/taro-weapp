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
            <View className="title">分享给你的朋友</View>
            <View className="content">点击右上角选择转发分享给你的朋友</View>
            <View className='footer-tip'>
                问题或者建议请发送邮件致ytu_94@163.com，您的反馈是我们前进的动力。
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
