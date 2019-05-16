import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtButton, AtCard, AtModal } from 'taro-ui'

export default class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  constructor() {
    super(...arguments)
    this.state = {
      title: 'Ytu',
      isOpened: false
    }
  }

  config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount() {
    Taro.request({
      url: 'http://localhost:8080/test',
      data: {
        foo: 'foo',
        bar: 10
      },
      header: {
        'content-type': 'application/json'
      }
    }).then(res => console.log(res.data))
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  goPage = (e, index) => {
    console.log(e, index)
    Taro.navigateTo({
      url: '/pages/joinAction/index'
    })
  }

  join = e => {
    console.log(e)
    this.setState({
      isOpened: true
    })
  }
  handleClose = e => {
    console.log(e)
    this.setState({
      isOpened: false
    })
  }
  handleCancel = e => {
    console.log(e)
    this.setState({
      isOpened: false
    })
  }
  handleConfirm = e => {
    console.log(e)
    this.setState({
      isOpened: false
    })
  }

  render() {
    return (
      <View className='index'>
        <h1>欢迎使用 y约玩</h1>
        <AtCard note='小Tips' extra='额外信息' title='这是个标题' thumb='' />
        <AtButton type='primary' onClick={this.join}>
          赴约
        </AtButton>

        <View className='footer'>
          <AtButton type='primary'>发起行动</AtButton>
        </View>
        <AtModal
          isOpened={this.state.isOpened}
          title='标题'
          cancelText='取消'
          confirmText='确认'
          onClose={this.handleClose}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content='确定参加该活动吗？'
        />
      </View>
    )
  }
}
