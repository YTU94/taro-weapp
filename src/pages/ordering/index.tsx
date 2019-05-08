import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import { AtButton, AtCard, AtInputNumber, AtInput, AtForm } from "taro-ui"

import './index.less'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }
  constructor () {
    super()
    this.state = {
      value: 1
    }
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleChange (e) {
    console.log(e)
  }

  render () {
    return (
      <View className='ordering'>
        <View>
          <Swiper
            className='test-h'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            vertical
            circular
            indicatorDots
            autoplay>
            <SwiperItem>
              <View className='demo-text-1'>1</View>
            </SwiperItem>
            <SwiperItem>
              <View className='demo-text-2'>2</View>
            </SwiperItem>
            <SwiperItem>
              <View className='demo-text-3'>3</View>
            </SwiperItem>
          </Swiper>

          <Text>Hello world!</Text>

          <AtCard
            note='小Tips'
            extra='额外信息'
            title='这是个标题'
            thumb='http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG'
          >
            这也是内容区 可以随意定义功能
          </AtCard>
        </View>
        <View className="footer">
          <AtInputNumber
            min={0}
            max={10}
            step={1}
            className="footer-num"
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
          />
          <AtButton className="footer-btn" type='primary'>买买买</AtButton>
        </View>
      </View>
    )
  }
}
