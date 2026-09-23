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

// 后端登录接口域名
//
// ⚠️ 现状：原后端 ggapi.ytuj.cn 的 DNS 记录已被撤销（该子域已不存在，根域 ytuj.cn
//    只剩 403），服务端实际已下线。这里留空 = 离线模式：启动时不发任何网络请求，
//    玩家数据只落本地 Storage（与项目「数据只落本地」的约定一致），
//    控制台因此不会再出现 request:fail / 未捕获 Promise 的报错。
//    后端恢复后把域名填回这里，「登录换 token」流程会自动重新生效。
const API_HOST = ''

// Taro 的 API 在失败时会把返回的 Promise reject 掉；只传 success 而不接住它，
// 就会变成 unhandled rejection 并在控制台报错。这里统一吞掉，失败路径由 fail 处理。
function swallow(p) {
    if (p && typeof p.catch === 'function') p.catch(() => {})
}

// 登录换 token（仅在配置了 API_HOST 时执行），所有失败路径都就地消化
function loginQuietly() {
    swallow(
        Taro.login({
            success(res) {
                if (!res.code) return
                swallow(
                    Taro.request({
                        method: 'POST',
                        url: `${API_HOST}/api/v1/addUser`,
                        data: { code: res.code },
                        success(response) {
                            // 响应体可能为空/非预期结构，取值前先兜住
                            const token = response && response.data && response.data.token
                            if (token) Taro.setStorageSync('token', token)
                        },
                        fail(err) {
                            console.warn('[login] 换取 token 失败：', err)
                        }
                    })
                )
            },
            fail(err) {
                console.warn('[login] Taro.login 失败：', err)
            }
        })
    )
}

function App({ children }) {
    useLaunch(() => {
        if (!API_HOST) return
        loginQuietly()
    })

    // children 是将要渲染的页面
    return children
}

export default App
