import Taro, { useState, useEffect, useShareAppMessage } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtModalContent, AtModal } from "taro-ui";
import "./index.less";

function Index(params) {
    const [state, setstate] = useState(false);
    return (
        <View>
            <View>{state}</View>
        </View>
    );
}

Index.config = {
    navigateBarTitleText: "谁是卧底"
};

export default Index;
