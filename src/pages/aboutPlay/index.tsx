import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtButton, AtList, AtListItem } from "taro-ui"

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

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  goPage = (e, index) => {
    console.log(e, index)
    Taro.navigateTo({
      url: '/pages/joinAction/index'
    })
  }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <h1>欢迎使用 y约玩</h1>
        <AtList>
          <AtListItem
            onClick={this.goPage}
            title='标题文字-点击'
            arrow='right'
            thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
          />
          <AtListItem
            title='标题文字'
            note='描述信息'
            arrow='right'
            thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
          />
          <AtListItem
            title='标题文字'
            note='描述信息'
            extraText='详细信息'
            arrow='right'
            thumb='http://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png'
          />
        </AtList>
        <View className="footer">
          <AtButton type='primary'>发起行动</AtButton>
        </View>
      </View>
    )
  }
}
