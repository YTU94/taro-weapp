import Taro, { useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo } from "@tarojs/taro"
import { View } from "@tarojs/components"

export default function Counter({ initialCount }) {
    const [count, setCount] = useState(initialCount)
    return (
        <View>
            <Button onClick={() => setCount(prevCount => prevCount + 1)}>+</Button>
            <Button onClick={() => setCount(prevCount => prevCount - 1)}>-</Button>
        </View>
    )
}
