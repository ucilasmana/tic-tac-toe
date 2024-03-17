import {useState, useEffect, useRef} from 'react'
import "./Board.css"
import ScoreBoard from './ScoreBoard';

const Board = () => {

  const board = useRef(Array(9).fill(null))

  //const [board, setBoard] = useState(Array(9).fill(null))

  const [player, setPlayer] = useState(true);
  const [gameOver, setGameOver]=useState(false)
  const [scores, setScores] = useState({xScore:0, oScore:0})

  const [history, setHistory]=useState([]);
  const [sameIndex, setSameIndex]=useState(false)

  const WIN_CONDITIONS = useRef([
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ])

  //Modal
  const modal = useRef(null)
  const [messages, setMessages] = useState(null)
  
 
  useEffect(() => {

    if(sameIndex)
    {
    setHistory(history=>history)
    setSameIndex(!sameIndex)
    }

    if(gameOver)
    {
      board.current=Array(9).fill(null)
      setHistory([])
      setGameOver(!gameOver)
    }

}, [sameIndex, gameOver]);



const checkWinner = (board) =>{
   
  for (let i = 0; i<WIN_CONDITIONS.current.length; i++)
  {
    const[x, y, z] =  WIN_CONDITIONS.current[i]
   
    if(board[x]&&board[x] === board[y] && board[y] === board[z])
    {
        return board[x];   
    }
  }
 
}

  const handleBoxClick = (boxIndex) =>  {

  /*  setBoard(board.map((value, index) =>
    {
      if(index===boxIndex)
      {
         if(player)
         {
          return "X" 
         }
        else{
          return "O"
        }
      }
      else{
        return value
      }
    }))
    */

      if(player)
      {
        board.current[boxIndex]= "X" 
      }
      else{
        board.current[boxIndex]="O"
      }

    setHistory([boxIndex, ...history])
    setPlayer(!player)

    if(!board.current.includes(null))
    {
      modal.current.style.setProperty("display", "block")
      setMessages("Tie!")
    }

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
    
      modal.current.style.setProperty("display", "block")
      setMessages("Player "+winner+" Wins!") 
     
    }   
  
  }

  const handlePrevClick=()=>{
    for(let indexBoard = 0; indexBoard<9; indexBoard++){
      if(history[0]===indexBoard)
      {
        setSameIndex(!sameIndex)
        history.splice(0, 1);
        board.current.splice(indexBoard, 1, null);
        return
      }
    }
   }

  const closeModal = () => {
    modal.current.style.setProperty("display", "none")
    setGameOver(!gameOver)
   }

  return (
    <>
   <div className="score">
        <ScoreBoard scores={scores}/>
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
            <button className="reset-btn" onClick={()=> setGameOver(!gameOver) }>Reset Board</button>
      </div>
      </div>
      <div ref={modal} className='modal'>
        <div className='container'>
          <h1>{messages}</h1>
          <br/>
          <button onClick={()=>closeModal()}>close</button>
        </div> 
      </div>
    </>
  )
}

export default Board