import Taro, { useState, useEffect, useShareAppMessage } from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import {
    AtButton,
    AtModalContent,
    AtModal,
    AtModalHeader,
    AtModalAction
} from "taro-ui";
import "./index.less";

function Index() {
    const [num, setnum] = useState(1);
    const [isOpened, setisOpened] = useState(false);
    const [showExpain, setshowExpain] = useState(false);
    const [showPlayModel, setshowPlayModel] = useState(true);

    const select = e => {
        setisOpened(true);
    };
    const handleClose = e => {
        setisOpened(false);
    };

    const selectNum = e => {
        return Math.floor(Math.random() * 54) + 1 || 1;
    };

    useEffect(() => {
        if (!isOpened) return;
        const num = selectNum();
        setnum(num);
    }, [isOpened]);

    const tModel = (
        <AtModal isOpened={showPlayModel} onClose={handleClose}>
            <AtModalHeader>玩法介绍</AtModalHeader>
            <AtModalContent>
                <Swiper
                    className="test-h"
                    indicatorColor="#999"
                    indicatorActiveColor="#333"
                    circular
                    indicatorDots
                >
                    <SwiperItem>
                        <View className="demo-text-1">
                            玩法一： 酒桌方一个空碗， 每人选一张牌，
                            不要被别人看到， 然后往碗里一直倒酒， 如果有人心虚，
                            就喊停， 喊停的人就要喝掉碗里的酒， 没人喊停就倒满，
                            然后牌面最小的人喝酒。
                        </View>
                    </SwiperItem>
                    <SwiperItem>
                        <View className="demo-text-2">
                            玩法二： 酒桌方一个空碗， 每人选一张牌，
                            注意自己不可看这个牌， 需要把牌给其他人看，
                            然后同上， 你觉得桌上有比你小的牌， 就不喊停，
                            直到酒满， 最后比大小。
                        </View>
                    </SwiperItem>
                </Swiper>
            </AtModalContent>
        </AtModal>
    );
    return (
        <View className="puke-game">
            <View className="puke-game-c">
                <View className="title"> 随机选牌 </View>
                <AtButton className="puke-btn" type="primary" onClick={select}>
                    选牌
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
                        玩法一： 酒桌方一个空碗， 每人选一张牌，
                        不要被别人看到， 然后往碗里一直倒酒， 如果有人心虚，
                        就喊停， 喊停的人就要喝掉碗里的酒， 没人喊停就倒满，
                        然后牌面最小的人喝酒。
                    </View>
                    <View style="text-align:left;">
                        玩法二： 酒桌方一个空碗， 每人选一张牌，
                        注意自己不可看这个牌， 需要把牌给其他人看， 然后同上，
                        你觉得桌上有比你小的牌， 就不喊停， 直到酒满，
                        最后比大小。
                    </View>
                </View>
            </View>
            {showPlayModel ? tModel : ""}
            <AtModal isOpened={isOpened} onClose={handleClose}>
                <AtModalContent>
                    <image
                        className="puke-img"
                        src={`http://assets.ytuj.cn/img/pukeImage/${num}.jpg`}
                        alt="loading"
                        style="width:100%;"
                        mode="widthFix"
                    />
                </AtModalContent>
            </AtModal>
        </View>
    );
}

Index.config = {
    navigationBarTitleText: ""
};

export default Index;
