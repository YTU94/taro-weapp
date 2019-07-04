import Taro, { Component } from "@tarojs/taro"
import { View } from "@tarojs/components"
import { AtInput } from "taro-ui"
import "./index.less"
import planeIconImg from "../../assets/images/plane-icon.png"

class CusInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ""
        }
    }
    onConfirm(e) {
        this.props.onSubmit(this.state.value)
    }
    onSubmit(e) {
        this.props.onSubmit(this.state.value)
    }
    onBlur(e) {
        this.props.onBlur(e)
    }
    handleInputChange = v => {
        this.setState({
            value: v
        })
    }

    render() {
        return (
            <View className='input-box'>
                <AtInput
                    clear
                    cursor-spacing='140'
                    auto-focus={this.props.show}
                    name='value'
                    type='text'
                    placeholder=''
                    value={this.state.value}
                    onChange={this.handleInputChange.bind(this)}
                    onConfirm={this.onConfirm.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                />
                <View className='input-icon' onClick={this.onSubmit.bind(this)}>
                    <image src={planeIconImg} alt='' mode='widthFix' />
                </View>
            </View>
        )
    }
}

export default CusInput
