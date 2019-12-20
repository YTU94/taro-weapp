import Taro, { useState, useEffect, useShareAppMessage } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtModalContent, AtModal } from "taro-ui";
import "./index.less";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

function Index() {
    const [isOpened, setisOpened] = useState(false);
    const [numArr, setnumArr] = useState([]);

    const start = e => {
        setisOpened(true);
    };
    const handleClose = e => {
        setisOpened(false);
    };
    const selectNum = e => {
        let arr = [];
        for (let index = 0; index < 3; index++) {
            const i = getRandomInt(1, 55);
            if (arr.includes(i)) {
                index--;
            } else {
                arr.push(i);
            }
        }
        return arr;
    };

    useEffect(() => {
        if (!isOpened) return;
        const arr = selectNum();
        setnumArr(arr);
    }, [isOpened]);

    useShareAppMessage(res => {
        return {
            title: "账号分享",
            path: "/pages/tabBar/share/index"
        };
    });

    return (
        <View className="twentyFour-game">
            <View className="title">24点</View>
            <AtButton className="puke-btn" type="primary" onClick={start}>
                开始
            </AtButton>

            <View className="expain">
                <View
                    className="explain-label"
                    type="secondary"
                    size="small"
                    onClick={this.showExpainModal}
                >
                    🎮玩法介绍：
                </View>
                <View style="text-align:left;">
                    看谁最快利用➕➖✖️➗将3张扑克牌计算出24。
                </View>
            </View>

            <AtModal isOpened={isOpened} onClose={handleClose}>
                <AtModalContent>
                    <View className="imgBox">
                        {numArr.map(e => {
                            return (
                                <image
                                    className="puke-img"
                                    src={`http://assets.ytuj.cn/img/pukeImage/${e}.jpg`}
                                    alt="loading"
                                    style="width:100%;margin:200rpx 5rpx;"
                                    mode="widthFix"
                                />
                            );
                        })}
                    </View>
                </AtModalContent>
            </AtModal>
        </View>
    );
}

Index.config = {
    navigationBarTitleText: "24点"
};

export default Index;
