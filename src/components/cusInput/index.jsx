import { View, Image } from '@tarojs/components'
import { useState } from 'react'
import { AtInput } from 'taro-ui'
import planeIconImg from '../../assets/images/plane-icon.png'
import './index.less'

export default function CusInput(props) {
    const [value, setValue] = useState('')

    const submit = () => {
        props.onSubmit(value)
    }

    return (
        <View className='input-box'>
            <AtInput
                clear
                cursorSpacing={140}
                autoFocus={props.show}
                name='value'
                type='text'
                placeholder=''
                value={value}
                onChange={setValue}
                onConfirm={submit}
                onBlur={e => props.onBlur(e)}
            />
            <View className='input-icon' onClick={submit}>
                <Image src={planeIconImg} mode='widthFix' />
            </View>
        </View>
    )
}
