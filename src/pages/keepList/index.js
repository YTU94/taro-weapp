import Taro, {Component, Config} from "@tarojs/taro"
import {View, Text, Swiper, SwiperItem} from "@tarojs/components"
import {AtButton, AtDrawer, AtForm, AtSwitch, AtCheckbox, AtCard, AtInputNumber, AtInput} from "taro-ui"

import "./index.less"
import planeIconImg from "../../assets/images/plane-icon.png"

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
        super()
        this.state = {
            value: "",
            curStatus: 0,
            show: false,
            checkedList: [],
            checkboxOption: []
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
        Taro.request({
            url: "https://ggapi.ytuj.cn/api/v1/keepList",
            method: "GET",
            data: {
                status: this.state.curStatus
            },
            header: {
                "x-token": Taro.getStorageSync("token"),
                "content-type": "application/json"
            }
        }).then(res => {
            const arr = res.data.data.map(e => {
                return {
                    value: e.id,
                    label: e.content,
                    disabled: e.status > 0
                }
            })
            this.setState({
                checkboxOption: arr
            })
            if (this.state.curStatus === 1) {
                const a = res.data.data.map(e => e.id)
                this.setState({
                    checkedList: a
                })
            }
        })
    }

    handleChange = value => {
        // this.setState({
        //     checkedList: value
        // })
        let that = this
        console.log("value", value)
        Taro.request({
            url: "https://ggapi.ytuj.cn/api/v1/updateStatus",
            method: "POST",
            data: {
                id: value[0],
                status: 1
            },
            header: {
                "x-token": Taro.getStorageSync("token"),
                "content-type": "application/json"
            }
        }).then(res => {
            console.log(res)
            that.init()
        })
    }
    handleInputChange = v => {
        this.setState({
            value: v
        })
    }

    inputOver = e => {
        console.log("blur")
        this.setState({
            show: false
        })
    }

    add = e => {
        this.setState({
            show: true
        })
    }

    submit = e => {
        let that = this
        Taro.request({
            url: "https://ggapi.ytuj.cn/api/v1/addKeepItem",
            method: "POST",
            data: {
                content: this.state.value
            },
            header: {
                "x-token": Taro.getStorageSync("token"),
                "content-type": "application/json"
            }
        }).then(res => {
            console.log(res)
            that.init()
        })
    }
    handleChangeStatus = e => {
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
        let inputArea
        if (this.state.show) {
            inputArea = (
                <View className='input-box'>
                    <AtInput
                        className='input-tag'
                        cursor-spacing='140'
                        auto-focus={this.state.show}
                        name='value1'
                        type='text'
                        placeholder=''
                        value={this.state.value}
                        onChange={this.handleInputChange.bind(this)}
                        onConfirm={this.submit.bind(this)}
                        onBlur={this.inputOver.bind(this)}
                    />
                    <View className='input-icon' onClick={this.submit.bind(this)}>
                        <image src={planeIconImg} alt='' mode='widthFix' />
                    </View>
                </View>
            )
        }
        return (
            <View className='keep-list'>
                <View>
                    {/* <Text className='title'> Keep List </Text> */}
                    <AtForm>
                        <AtSwitch title={this.state.curStatus === 0 ? "待完成" : "已完成"} onChange={this.handleChangeStatus} />
                    </AtForm>
                    <AtCheckbox
                        options={this.state.checkboxOption}
                        selectedList={this.state.checkedList}
                        onChange={this.handleChange.bind(this)}
                    />
                </View>
                <View className='footer'>
                    <AtButton onClick={this.add.bind(this)} className='footer-btn' type='primary'>
                        添加
                    </AtButton>
                </View>
                {inputArea}
                {/* <AtDrawer show={this.state.show} mask>
                                    <View className='drawer-item'>优先展示items里的数据</View>
                                    <View className='drawer-item'>如果items没有数据就会展示children</View>
                                    <View className='drawer-item'>
                                        这是自定义内容 <AtIcon value='home' size='20' />
                                    </View>
                                    <View className='drawer-item'>这是自定义内容</View>
                                </AtDrawer> */}
            </View>
        )
    }
}
