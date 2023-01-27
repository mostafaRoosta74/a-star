let board_values = [7,5,6,1,4,3,2,0,-1];
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
  // if (history.length > 4000){
  //   console.log("a",board_values,available,road)
  //   // setBoard_values(board_values)
  //   return "a"
  // }
  if (JSON.stringify(board_values)===JSON.stringify([0, 1, 2, 3, 4, 5, 6, 7, -1])){
    console.log("end",road,history.length)
    // setResultrow(road.split(","));
    return "end"+road
  }

  getAllMoves(board_values).forEach(item => {
    if (!road || road.split(",").pop() !== item+""){
      const newBoardValues = handleClick(item,board_values)
      if (!(history.map(item =>JSON.stringify(item)).includes(JSON.stringify(newBoardValues)))){
        if (road.split(",").length < 32){
          available.push({
            key:!!road?road+","+item:item+"",
            cost: road.split(",").length + howMuchUntilEnd(newBoardValues)*19,
            new_board_values:newBoardValues
          })
        }
      }
    }
  });
  // select
  let min = 9999999999999999999999;
  let minItemIndex = 0;

  // available.forEach((item,index) => {
  //   if (min >item.cost+item.key.split(",").length){
  //     min =item.cost
  //     minItemIndex = index
  //   }
  // })
  const sortedAvailable =available.sort((a, b) => {
    const aKeyLength = a.key.split(',').length;
    const bKeyLength = b.key.split(',').length;
    return String(a.cost).localeCompare(String(b.cost)) || aKeyLength - bKeyLength
  })
  // select
  const newItem = sortedAvailable[0];
  history.push(newItem.new_board_values)
  sortedAvailable.splice(0,1)
  setTimeout(() => {
    console.log(newItem.key,newItem.cost);
    thinking(newItem.new_board_values,sortedAvailable,newItem.key,history)
  }, 0)
}

const available = [];
const history = [];
thinking(board_values,available,"",history)
