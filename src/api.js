import Taro from "@tarojs/taro"

const HOST = "https://ggapi.ytuj.cn"

const http = function(params = {}) {
    return new Promise((resolve, reject) => {
        Taro.request({
            url: `${params.host || HOST}${params.url || ""}`,
            method: params.method || "GET",
            data: params.data || {},
            header: {
                "x-token": Taro.getStorageSync("token"),
                "content-type": "application/json"
            }
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                Taro.showToast({
                    title: err.msg || "未知错误",
                    icon: "none",
                    mask: true
                })
            })
    })
}

export default http
