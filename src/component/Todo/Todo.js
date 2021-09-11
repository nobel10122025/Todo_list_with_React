import { useState , useEffect} from "react"

// getting local storage with getItem()
const getLocalData=() =>{
    const lists = localStorage.getItem("myTodoList")
    if(lists){
        return JSON.parse(lists)        // it will be in string to convert it to  array
    }
    else{
        return []
    }
}

function Todo() {

    //React hooks
    const [item,setItem] = useState("")
    const [menu,setMenu]=useState(getLocalData())
    const [editItemNew,seteditItemNew]=useState("")
    const [toggleIcon,setToggleIcon] = useState(false)
    
    //adding a item
    function addItem(event){
        setItem(event.target.value)
    }

    //adding a item to list 
    function addToList(){
        if(!item){
            alert("please enter the task")
        }
        else if (item && toggleIcon){
           setMenu(
            menu.map((curEle)=>{
                if(curEle.id===editItemNew){
                    return {...curEle , name:item}
                }
                return curEle
            }))
            seteditItemNew("")
            setItem("")
            setToggleIcon(false)
        }
        else{
            const myNewItem = {
            id:new Date().getTime().toString(),
            name:item,
        }
        setMenu([...menu,myNewItem])
        setItem("")
        }
        
    }
    //editing a item
    function editItem(index){
        const updatedEditList = menu.find((curElem)=>{return curElem.id === index})
        seteditItemNew(index)
        setItem(updatedEditList.name)
        setToggleIcon(true)
    }

    //deleting a item
    function deleteItem(index){
        const updatedItem = menu.filter((curEle)=>{
           return (curEle.id !== index);
        })
        setMenu(updatedItem);
    }
    
    //clearing the whole list
    function removeAll(){
        setMenu([])
    }
    useEffect(() => {
        localStorage.setItem("myTodoList",JSON.stringify(menu))
    }, [menu])
    return (
        <div className="container">
            <h3 className="heading">To do list..</h3>
            <p className="desc"> Lets start for the Day</p>
            <form>
                <input placeholder="Enter task" value={item} onChange={addItem} className="input-area input"/>
                    {
                        toggleIcon?<i className="fas fa-edit" onClick ={addToList}></i>:
                        <i className="fas fa-plus-circle" onClick ={addToList}></i>
                    }
                    
                <div className="show-item">
                        {
                            menu.map((curEle)=>{
                                return(
                                <div className="each-item input" key={curEle.id}>
                                    <h3>{curEle.name}</h3>
                                    <div className="todo-btn">
                                        <i className="fas fa-edit" onClick={()=>{editItem(curEle.id)}}></i>
                                        <i className="far fa-trash-alt" onClick={()=>{deleteItem(curEle.id)}}></i>
                                    </div>
                                </div>
                                )
                            })
                        }
                </div>
            </form>
            <input type="button" value="Remove all"  className="submit-btn" onClick={()=>{removeAll()}}/>
        </div>
    )
}

export default Todo
