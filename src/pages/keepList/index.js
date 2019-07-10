import Taro, { Component } from "@tarojs/taro"
import { View } from "@tarojs/components"
import { AtButton, AtForm, AtSwitch, AtCheckbox, AtInput } from "taro-ui"

import "./index.less"
import http from "../../api"
import CusInput from "../../components/cusInput"
export default class Index extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config = {
        navigationBarTitleText: "keep清单"
    }
    constructor() {
        super(...arguments)
        this.state = {
            value: "",
            curStatus: 0,
            show: false,
            selectedList: [],
            optionList: []
        }
    }
    onShareAppMessage(res) {
        return {
            path: "/pages/tabBar/index/index"
        }
    }
    componentWillMount() {
        this.init()
    }

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    init = e => {
        http({
            url: "/api/v1/keepList",
            data: {
                status: this.state.curStatus
            }
        }).then(res => {
            const arr = res.data.map(e => {
                return {
                    value: e.id,
                    label: e.content,
                    disabled: e.status > 0
                }
            })
            this.setState({
                optionList: arr,
                selectedList: []
            })
            if (this.state.curStatus === 1) {
                const a = res.data.map(e => e.id)
                this.setState({
                    selectedList: a
                })
            }
        })
    }

    handleChange = value => {
        let that = this
        http({
            url: "/api/v1/updateStatus",
            method: "POST",
            data: {
                id: value[0],
                status: 1
            }
        }).then(res => {
            const a = [value[0]]
            this.setState({
                selectedList: a
            })
            setTimeout(() => {
                that.init()
            }, 600)
        })
    }
    handleInputChange = v => {
        this.setState({
            value: v
        })
    }

    inputOver = e => {
        this.setState({
            show: false
        })
    }

    add = e => {
        this.setState({
            show: true
        })
    }

    onSubmit(v) {
        if (!v) {
            Taro.showToast({
                title: "内容不能为空",
                icon: "none",
                duration: 1500
            })
            return false
        }
        http({
            url: "/api/v1/addKeepItem",
            method: "POST",
            data: {
                content: v
            }
        }).then(res => {
            this.init()
        })
    }
    changeStatus = e => {
        const that = this
        this.setState(
            {
                curStatus: this.state.curStatus === 0 ? 1 : 0
            },
            () => {
                that.init()
            }
        )
    }

    render() {
        return (
            <View className='keep-list'>
                <View>
                    <AtForm>
                        <AtSwitch title={this.state.curStatus === 0 ? "待完成" : "已完成"} onChange={this.changeStatus} />
                    </AtForm>
                    <AtCheckbox
                        options={this.state.optionList}
                        selectedList={this.state.selectedList}
                        onChange={this.handleChange.bind(this)}
                    />
                </View>
                <View className='footer'>
                    <AtButton onClick={this.add.bind(this)} className='footer-btn' type='primary'>
                        添加
                    </AtButton>
                </View>
                {this.state.show && (
                    <CusInput show={this.state.show} onSubmit={this.onSubmit.bind(this)} onBlur={this.inputOver.bind(this)} />
                )}
            </View>
        )
    }
}
