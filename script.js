function Gameboard(){
    const board=[];
    for (let i=0;i<3;i++){
        board[i]=[];
        for(let j=0;j<3;j++){
            board[i].push(Cell());
        }
    }
    const getBoardValues=()=>
        {return (board.map(row=>row.map(cell=>cell.getValue())))};
    const addSymbol=(row,column,player)=>{
    board[row][column].setValue(player);
      }
      return{
        getBoardValues,
        addSymbol
    }
}

function Cell(){
    let value='';
    const getValue=()=>value; 
    const setValue=(player)=>value=player.token;
    return{
        getValue,
        setValue
    }
}

function BoardController(){
    const board=Gameboard();
    const players=[
        {name:'Player One',
            token:'X'
        },
        {name:'Player Two',
            token:'0'
        }
    ]
    let activePlayer=players[0];
    const switchCurrentPlayer=()=>activePlayer=activePlayer===players[0]?players[1]:players[0];
    const checkWinner=(values)=>{
        const winnings=[];
        for(let i=0;i<7;i+=3){winnings.push(values[i]+values[i+1]+values[i+2])}
        for(let i=0;i<3;i++){winnings.push(values[i]+values[i+3]+values[i+6])}
        winnings.push(values[0]+values[4]+values[8])
        winnings.push(values[2]+values[4]+values[6])
        return winnings.some(el=>el==='000'||el==='XXX')
    }
    const checkTie=(boardValues)=>{
        return !boardValues.some(el=>el==='');
    }
    const playRound=(row,column)=>{
        if (board.getBoardValues()[row][column]) return `${activePlayer.name} Turn`;
        board.addSymbol(row,column,activePlayer);
        //Check if player wins
        if(checkWinner(board.getBoardValues().flat())) 
            {   
                return `${activePlayer.name} wins!!!`
            }
        //Check if it is a tie
        if (checkTie(board.getBoardValues().flat())) return `It's a tie.`
        //Continue with the other player
        switchCurrentPlayer()
        return `${activePlayer.name} Turn`
    }
    return {
        playRound,
        getBoardValues:board.getBoardValues
    }

}

function ScreenController(){
    const game=BoardController();
    const container=document.querySelector('.container');
    const turn=document.querySelector('.turn');

    const updateScreen=()=>{
        //Clear board
        container.textContent='';

        //Render game cells
        game.getBoardValues().forEach((row,i)=>row.forEach((cell,j)=>{
            const cellElement=document.createElement('button');
            cellElement.classList.add('cell');
            cellElement.dataset.cell=`${i}${j}`
            cellElement.innerText=cell;
            container.appendChild(cellElement)
        }))
    }

    function clickHandlerBoard(e){
        const cell=e.target.dataset.cell.split('');      
        const roundResult=game.playRound(+cell[0],+cell[1]);
        turn.innerText=roundResult;

        //Stop adding symbols in case of win or tie
        if(roundResult.match(/win|tie/)) container.removeEventListener('click',clickHandlerBoard)
        updateScreen();
    }
    container.addEventListener('click',clickHandlerBoard)
    updateScreen()
}

ScreenController()


