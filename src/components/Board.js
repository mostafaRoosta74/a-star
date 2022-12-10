import React, {useState, useEffect} from 'react'
import Square from './Square'

export default function Board() {
  //const [board_values, setBoard_values] = useState([7,3,0,2,1,5,6,4,-1]);
  const [board_values, setBoard_values] = useState([7,5,6,1,4,3,2,-1,0]);
  const [win_state, setWin_state] = useState(0);
  const [resultRow,setResultrow] = useState([]);
  useEffect(()=>{
      handleShuffleClick()
  },[])
  useEffect(()=>{
    if (JSON.stringify(board_values)===JSON.stringify([0, 1, 2, 3, 4, 5, 6, 7, -1])){
      setWin_state(1);
    }
    else{
      setWin_state(0);
    }
  },[board_values]);

  useEffect(()=>{
    if (resultRow.length){
      startSolving()
    }
  },[resultRow])


  function handleClick(num,board_values){
    const num_idx = board_values.indexOf(num);
    const num_row = parseInt(num_idx/3);
    const num_col = num_idx%3;
    const zero_idx = board_values.indexOf(-1);
    const zero_row = parseInt(zero_idx/3);
    const zero_col = zero_idx%3;
    const differ = Math.abs(num_row-zero_row)+Math.abs(num_col-zero_col);
    if (differ===1){
      let board_values_copy = Array.from(board_values);
      [board_values_copy[num_idx], board_values_copy[zero_idx]] = [board_values_copy[zero_idx], board_values_copy[num_idx]];
      return (board_values_copy);
    }
    return 0
    
  }
  function handleShuffleClick(){
    let num_array = [0, 1, 2, 3, 4, 5, 6, 7]
    for (let i = num_array.length-1; i>=0; i--){
      const randomIndex = Math.floor(Math.random()*(i+1));  
      [num_array[randomIndex], num_array[i]] = [num_array[i], num_array[randomIndex]];
    }
    num_array.push(-1)
    setBoard_values(num_array);
  }

  ////////////////////////  START Solve funcs
  function get_xy_position(num) {
    switch (num) {
      case 0:
        return [0,0]
      case 1:
        return [1,0]
      case 2:
        return [2,0]
      case 3:
        return [0,1]
      case 4:
        return [1,1]
      case 5:
        return [2,1]
      case 6:
        return [0,2]
      case 7:
        return [1,2]
      case 8:
        return [2,2]
      default:
        return [0,0]
    }
  }
  function xyToNumber(x,y) {
    return (y*3)+x;
  }
  function howMuchUntilEnd(board_values) {
    let result = 0;
    board_values.forEach((item,index) => {
      if (item !== -1){
        result += Math.abs(get_xy_position(index)[0] - get_xy_position(item)[0])
        result += Math.abs(get_xy_position(index)[1] - get_xy_position(item)[1])
      }else {
        result += Math.abs(get_xy_position(index)[0] - get_xy_position(8)[0])
        result += Math.abs(get_xy_position(index)[1] - get_xy_position(8)[1])
      }
    })
    return result;
  }
  function howMuchUntilEnd2(board_values) {
    let result = 0;
    board_values.forEach((item,index) => {
      result += (item === -1 ?8:item) === index? 0:1
    })
    return result;
  }
  function getAllMoves(board_values) {
    const listAvailableIndex = [];
    const zeroIndex = board_values.findIndex(item => item === -1);
    const [x,y] = get_xy_position(zeroIndex);
    switch (x) {
      case 0:
        listAvailableIndex.push([1,y])
            break;
      case 1:
        listAvailableIndex.push([0,y])
        listAvailableIndex.push([2,y])
        break;
      case 2:
        listAvailableIndex.push([1,y])
        break;
    }
    switch (y) {
      case 0:
        listAvailableIndex.push([x,1])
        break;
      case 1:
        listAvailableIndex.push([x,0])
        listAvailableIndex.push([x,2])
        break;
      case 2:
        listAvailableIndex.push([x,1])
        break;
    }
    return listAvailableIndex.map(([x,y])=>board_values[xyToNumber(x,y)])
  }
  function thinking(board_values,available,road,history) {
    if (history.length > 4000){
      console.log("a",board_values,available,road)
      setBoard_values(board_values)
      return "a"
    }
    if (JSON.stringify(board_values)===JSON.stringify([0, 1, 2, 3, 4, 5, 6, 7, -1])){
      console.log("end",road,history.length)
      setResultrow(road.split(","));
      return "end"+road
    }

    getAllMoves(board_values).forEach(item => {
      if (!road || road.split(",").pop() !== item+""){
        if (!(history.map(item =>JSON.stringify(item)).includes(JSON.stringify(handleClick(item,board_values))))){
          available.push({
            key:!!road?road+","+item:item+"",
            cost: road.split(",").length + howMuchUntilEnd(board_values)*19,
            new_board_values:handleClick(item,board_values)
          })
        }

      }
    });
    // select
    let min = 9999999999999999999999;
    let minItemIndex = 0;
    available.forEach((item,index) => {
      if (min >item.cost+item.key.split(",").length){
        min =item.cost
        minItemIndex = index
      }
    })
    // select
    const newItem = available[minItemIndex]
    history.push(newItem.new_board_values)
    available.splice(minItemIndex,1)
    thinking(newItem.new_board_values,available,newItem.key,history)
  }
  function handleSolveClick() {
    const available = [];
    const history = [];
    console.log(howMuchUntilEnd(board_values))
    console.log(howMuchUntilEnd2(board_values))
    thinking(board_values,available,"",history)

  }
  function startSolving() {
    let loop = 0
    let myInterval = setInterval(()=>{
      const a = document.getElementById(`box_${Number(resultRow[loop])+1}`)
      a.click();
      loop++;
      if (resultRow.length <= loop){
        clearInterval(myInterval);
      }
    },500)
  }
  //////////////////////// ENDs Solve funcs

  function handleModalClick(e) {
    if (e.target.className==='modal' || e.target.className==='close'){
      setWin_state(0);
    }  
  }

  return (
    <div>
      <div className='board'>
        {board_values.map(x => <Square num={x} key={x} handleClick={()=>setBoard_values(handleClick(x,board_values))}/>)}
      </div>
      <button className='shuffle' onClick={handleShuffleClick}> Shuffle</button>
      <button className='shuffle' onClick={handleSolveClick}> Solve</button>
      <div id="myModal" className="modal" state={win_state} onClick={handleModalClick}>
        <div className="modal-content">
            <span className="close">&times;</span>
            <p>Congratulations! You won!</p>
      </div>

</div>
    
    </div>
  )
}

