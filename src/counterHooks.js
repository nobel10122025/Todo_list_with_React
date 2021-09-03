import React, {useContext} from 'react';
import { useState } from 'react';
import { themeContext } from './App';

export default function CounterHooks({initialCount}){
    const [count,setCount]=useState(initialCount)
    const style = useContext(themeContext)
    return (
        <>
        <br/>
        <button style = {style} onClick={() => {setCount(prevCount => prevCount - 1)}}>-</button>
        <span>{count}</span>
        <button style = {style} onClick={() => {setCount(prevCount => prevCount + 1)}}>+</button>
        </>
    )
}