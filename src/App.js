import Counter from './counter.js'
import CounterHooks from './counterHooks.js';
import React , {useState} from 'react';
export const themeContext = React.createContext()

function App() {
  const [theme ,setTheme] = useState('red')
  return (
    <themeContext.Provider value = {{backgroundColor : theme}}>
    Counter
    <Counter initialCount = {0}/>
    CounterHooks
    <CounterHooks initialCount = {0}/>
    <br/>
    <button onClick={()=>setTheme(prevTheme => {
      return (prevTheme==='red'?'blue':'red')
    })}>Toggle Button</button>
    </themeContext.Provider>
  )
}

export default App;
