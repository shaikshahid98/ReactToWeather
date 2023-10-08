import React from "react"


const Button = (props) =>{
    
    return(
        <button className="m-5 p-3 font-bold transition-all ease-in 
        duration-75 bg-purple-600   hover:bg-purple-800 
        shadow-cyan-500/50 rounded-full">
            {props.text}
          </button>
    )
}
export default Button;