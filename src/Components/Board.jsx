import React, {useState, useEffect, useRef} from 'react'
import "./Board.css"
import ScoreBoard from './ScoreBoard';

const Board = () => {

  const board = useRef(Array(9).fill(null))
  const [history, setHistory]=useState([]);
  const [gameOver, setGameOver]=useState(false)
  const [sameIndex, setSameIndex]=useState(false)
  const [player, setPlayer] = useState(true);
  const [scores, setScores] = useState({xScore:0, oScore:0})

  const WIN_CONDITIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ]

  useEffect(() => {

      if(sameIndex)
      {
      setHistory(history)
      board.current=board.current
      setSameIndex(!sameIndex)
      }
      if(gameOver)
      {
        board.current=Array(9).fill(null)
        setHistory([])
        setSameIndex(false)
        setGameOver(!gameOver)
      }
 
  }, [sameIndex, gameOver]);

  const handleBoxClick = (boxIndex) =>  {
    
    board.current=board.current.map((value, index) => {

      if(index===boxIndex)
      {
        return player === true ? "X" : "O"
      }
      else{
        return value;
      }
    })
    setHistory([boxIndex, ...history])
    setPlayer(!player)

    const winner = checkWinner(board.current);
  
    if(winner){
      if(winner === "O"){
        let {oScore} = scores;
        oScore +=1 
        setScores({
          ...scores, oScore})
      }
      else{
        let {xScore} = scores;
        xScore +=1 
        setScores({
          ...scores, xScore}) 
      }
    }   
  }

  const checkWinner = (board) =>{
   
    for (let i = 0; i<WIN_CONDITIONS.length; i++)
    {
      const[x, y, z] =  WIN_CONDITIONS[i]
      
      if(board[x] && board[x] === board[y] && board[y] === board[z])
      {
        reset("Player " + board[x] + " Won!")
        return board[x];   
      }
    }
    if(!board.includes(null))
    {
      reset("Tie!")
    }
  }



  
  const handlePrevClick=()=>{
   for(let i = 0; i<history.length; i++){
      for(let j = 0; j<9; j++){
        if(history[i]===j)
        {
          history.splice(0, 1);
          board.current.splice(j, 1, null);
          setSameIndex(!sameIndex)
          return
        }
      }
    }
  
  }
  const reset = (stringValue) => {
    if(stringValue!==null)
    {
      alert(stringValue)
    }
    setGameOver(!gameOver)    
  }

  return (
    <>
    <div className="score">
        <ScoreBoard scores={scores} player={player}/>
    </div>
    <div className='board'>
      <div className='board-square'>
        {board.current.map((value, index) => {
              return <button key={index} className={`box 
              ${value === null ? "default"
              : value === "X" ? "x":"o"
              }`} onClick= {() => value === null && handleBoxClick(index)}>{value}</button>
          })}
      </div>
      <div className="board-action">
            <button className='prev-btn' onClick= {() => handlePrevClick()}>Previous Step</button>
            <button className="reset-btn" onClick={()=>reset(null)}>Reset Board</button>
      </div>
      </div>
    </>
  )
}

export default Board