import Taro, { useLaunch } from '@tarojs/taro'

import 'taro-ui/dist/style/components/grid.scss'
import 'taro-ui/dist/style/components/drawer.scss'
import 'taro-ui/dist/style/components/list.scss'
import 'taro-ui/dist/style/components/loading.scss'
import 'taro-ui/dist/style/components/input.scss'
import 'taro-ui/dist/style/components/icon.scss'
import 'taro-ui/dist/style/components/button.scss'
import 'taro-ui/dist/style/components/checkbox.scss'
import 'taro-ui/dist/style/components/modal.scss'
import 'taro-ui/dist/style/components/switch.scss'
import 'taro-ui/dist/style/components/noticebar.scss'

import './app.less'

function App({ children }) {
    useLaunch(() => {
        Taro.login({
            success(res) {
                if (res.code) {
                    // 发起网络请求，换取登录态 token
                    Taro.request({
                        method: 'POST',
                        url: 'https://ggapi.ytuj.cn/api/v1/addUser',
                        data: {
                            code: res.code
                        },
                        success(response) {
                            Taro.setStorageSync(
                                'token',
                                response.data.token || 'token'
                            )
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    })

    // children 是将要渲染的页面
    return children
}

export default App
