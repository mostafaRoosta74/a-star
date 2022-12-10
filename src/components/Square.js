import React from 'react'

export default function Square(props) {
  return (
    <div className='square' onClick={props.handleClick} num={props.num+1} id={`box_${props.num+1}`}>
      {props.num+1}
    </div>
  )
}
