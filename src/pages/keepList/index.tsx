import Taro, { Component, Config } from "@tarojs/taro"
import { View, Text, Swiper, SwiperItem } from "@tarojs/components"
import { AtButton, AtDrawer, AtCheckbox, AtCard, AtInputNumber, AtInput, AtForm } from "taro-ui"

import "./index.less"

export default class Index extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: "keep清单"
    }
    constructor() {
        super()
        this.state = {
            value: 1,
            show: false,
            checkedList: ["list1"]
        }
        this.checkboxOption = [
            {
                value: "list1",
                label: "iPhone X",
                desc: "部分地区提供电子普通发票，用户可自行打印，效力等同纸质普通发票，具体以实际出具的发票类型为准。"
            },
            {
                value: "list2",
                label: "HUAWEI P20"
            },
            {
                value: "list3",
                label: "OPPO Find X",
                desc: "部分地区提供电子普通发票，用户可自行打印，效力等同纸质普通发票，具体以实际出具的发票类型为准。",
                disabled: true
            },
            {
                value: "list4",
                label: "vivo NEX",
                desc: "部分地区提供电子普通发票，用户可自行打印，效力等同纸质普通发票，具体以实际出具的发票类型为准。",
                disabled: true
            }
        ]
    }
    componentWillMount() {
        Taro.request({
            url: "http://api.ytuj.cn/api/v1/ytu/articles",
            method: "GET",
            data: {
                page: 1,
                page_size: 10
            },
            header: {
                "content-type": "application/json"
            }
        }).then(res => {
            console.log(res)
        })
    }

    componentDidMount() {}

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    handleChange(e) {
        console.log(e)
    }

    handleChange = value => {
        this.setState({
            checkedList: value
        })
    }

    inputOver = e => {
        console.log(e)
        this.setState({
            show: false
        })
    }

    add = e => {
        console.log(e)
        this.setState({
            show: true
        })
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
                        title=''
                        type='text'
                        placeholder=''
                        value={this.state.value}
                        onChange={this.handleChange.bind(this)}
                        onConfirm={this.inputOver.bind(this)}
                        onBlur={this.inputOver.bind(this)}
                    />
                </View>
            )
        }
        return (
            <View className='keep-list'>
                <View>
                    <Text className='title'>Keep List</Text>
                    <AtCheckbox
                        options={this.checkboxOption}
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
