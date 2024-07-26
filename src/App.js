import { useState } from 'react';

function Square({value, onSquareClick}){

  return <button className="square" onClick={onSquareClick}> {value} </button>;
}

function Board({xIsNext, squares, onPlay}) {

  function handleClick(i){

      if(squares[i] || calculateWinner(squares)) //da true quando nell'array c'è gia scritto quialcosa|| controllo se il click ha portato un vincitore
      {
        return; //e quindi non fa aggiungere X o O o perche c'è un vincitore o perche la casella è gia piena
      }
    const nextSquares = squares.slice(); //creates a copy of the squares array (nextSquares) with the JavaScript slice() Array method

    if(xIsNext)
    {
        nextSquares[i]="X";
    }
    else
    {
        nextSquares[i]="O";
    }
    onPlay(nextSquares)
  }

  const winner=calculateWinner(squares);

  let status; //let è per dichiarare variabili che possono essere riassegnate (ha ambito di blocco)

  if(winner){
      status = "Il vincitore è: " + winner;
  }
  else{
      status = "È il turno di: " + (xIsNext ? "X" : "O");
  }

    return (
      <>
          <div className="status">{status}</div>
          <div className="board-row">
              <Square value={squares[0]}
                      onSquareClick={() => handleClick(0)}/> {/*ora i click sulle square sono gestiti dalla board! -->*/}
              <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
              <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
          </div>
          <div className="board-row">
              <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
              <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
              <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
          </div>
          <div className="board-row">
              <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
              <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
              <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
          </div>
      </>);
}



export default function Game(){
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove]; // assegna alla variabile currentquare, la mossa attuale

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove+1), nextSquares]; //current move+1 perche l'end in slice(start, end) non è incluso
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length-1);

    }

    function jumpTo(moveX){
        setCurrentMove(moveX);
    }

    const moves= history.map((elements,move)=>{ // elements sono gli array in history e move gli indici dellarray history che vengono scorsi
        let description;
        if(move>0)// quando nn sono alla 1 mossa
        {
            description='go to move #' + move;
        }
        else{
            description='go to game start';
        }
        return(
            <li key={move}> {/* in questo modo da agli elementi della lista un id cosi che react è in grado di renderizzare in maniera opportuna, è sconsigliato uasare però l'indice dellarray, ma essendo che in questo array non si devono fare modifiche/inserzioni in questo caso si puo fare */}
                <button onClick={()=> jumpTo(move)}>{description}</button>
            </li>
            // alla fine di map l'array moves sara costituito da tanti elementi di lista 'li' di button quanti gli el in history
        )
    })


    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>

    )
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],  // indici prima riga (combinazioni da controllare)
        [3, 4, 5],  // seconda riga
        [6, 7, 8],  // terza riga
        [0, 3, 6],  // prima colonna
        [1, 4, 7],  // seconda colonna
        [2, 5, 8],  // terza colonna
        [0, 4, 8],  // diagonale principale
        [2, 4, 6]   // diagonale secondaria
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { //squares[a] serve per vedere che la casella non sia vuota
            return squares[a];
        }
    }
    return null; //non c'è un vincitore in queso momento
}