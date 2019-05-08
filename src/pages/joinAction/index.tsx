import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { AtButton, AtList, AtCard, AtListItem } from "taro-ui"

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

  goPage = function  (e) {
    console.log('this', this)
  }

  test = (e) => {
    console.log('this', this)
  }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <h1>欢迎使用  **** 活动</h1>
        <AtCard
          note='小Tips'
          extra='额外信息'
          title='这是个标题'
          thumb='http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG'
        >
          这也是内容区 可以随意定义功能
        </AtCard>
        <AtList>
          <AtListItem
            onClick={this.goPage}
            title='时间'
            arrow='right'
            thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
          />
          <AtListItem
            onClick={this.test}
            title='地点'
            note='描述信息'
            arrow='right'
            thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
          />
          <AtListItem
            title='人物'
            note='描述信息'
            extraText='详细信息'
            arrow='right'
            thumb='http://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png'
          />
        </AtList>
        <View>
          <AtButton type='primary'>报名</AtButton>
        </View>
      </View>
    )
  }
}
