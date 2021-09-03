import React , {Component} from 'react';
import { themeContext } from './App';
export default class Counter extends Component{
    constructor(props){
        super(props)
            this.state = {
                count:this.props.initialCount
            }
        
    }
    render(){
        return(
            <themeContext.Consumer>
                { style =>(
            <div>
                <button style = {style} onClick={()=>{this.changeState(-1)}}>-</button>
                <span>{this.state.count}</span>
                <button style = {style} onClick={()=>{this.changeState(1)}}>+</button>
            </div>
            )}
                
            </themeContext.Consumer>
        )          
    }
    changeState(amount){
        this.setState(prevState => {
            return {count : prevState.count  + amount}
        }) 
    }
}