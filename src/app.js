import Taro, { Component } from "@tarojs/taro"

import "taro-ui/dist/style/components/grid.scss"
import "taro-ui/dist/style/components/drawer.scss"
import "taro-ui/dist/style/components/list.scss"
import "taro-ui/dist/style/components/loading.scss"
import "taro-ui/dist/style/components/input.scss"
import "taro-ui/dist/style/components/icon.scss"
import "taro-ui/dist/style/components/button.scss"
import "taro-ui/dist/style/components/checkbox.scss"
import "taro-ui/dist/style/components/modal.scss"
import "taro-ui/dist/style/components/switch.scss"
import "./app.less"

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config = {
        pages: [
            "pages/tabBar/index/index",
            "pages/tabBar/user/index",
            "pages/game/index",
            "pages/keepList/index",
            "pages/pukeGame/index",
            "pages/rotateGame/index",
            "pages/diceGame/index",
            "pages/signUp/index",
            "pages/msgCard/index"
        ],
        tabBar: {
            color: "#333333",
            selectedColor: "#6190E8",
            backgroundColor: "#fff",
            list: [
                {
                    iconPath: "./assets/images/game-default.png",
                    selectedIconPath: "./assets/images/game-active.png",
                    pagePath: "pages/tabBar/index/index",
                    text: "首页"
                },
                {
                    iconPath: "./assets/images/person-default.png",
                    selectedIconPath: "./assets/images/person-active.png",
                    pagePath: "pages/tabBar/user/index",
                    text: "我的"
                }
            ]
        },
        window: {
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#fff",
            navigationBarTitleText: "WeChat",
            navigationBarTextStyle: "black"
        },
        navigateToMiniProgramAppIdList: ["wx18a2ac992306a5a4"]
    }

    componentDidMount() {}

    componentDidShow() {
        Taro.login({
            success(res) {
                if (res.code) {
                    console.log("code", res.code)
                    // Taro.setStorageSync("code", res.code)
                    //发起网络请求
                    Taro.request({
                        method: "POST",
                        url: "https://ggapi.ytuj.cn/api/v1/addUser",
                        data: {
                            code: res.code
                        },
                        success(response) {
                            Taro.setStorageSync("token", response.data.token || "token")
                        }
                    })
                } else {
                    console.log("登录失败！" + res.errMsg)
                }
            }
        })
    }

    componentDidHide() {}

    componentDidCatchError() {}

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render() {
        return <Index />
    }
}

Taro.render(<App />, document.getElementById("app"))
