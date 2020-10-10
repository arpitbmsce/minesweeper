import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    // Assumption is that -1 is the Mine in our data
    const mineData = [
      [1,  2,  1,  1, 0, 0],
      [-1, 2, -1,  1, 0, 0],
      [1,  1,  1,  1, 0, 0],
      [0,  0,  0,  0, 0, 0],
      [2,  3,  2,  2, 1, 1],
      [-1, -1, -1, 2, -1, 1]
    ] || [];
    // initialize the array of same size as mineData to hold information which cells are clicked
    const cellClick = new Array(mineData.length).fill(0).map(() => {
      return new Array(mineData[0].length).fill(false);
    });
    let numOfMines = 0;
    mineData.forEach(row => row.forEach(cell => {
      if(this.isMine(cell)) {
        numOfMines++;
      }
    }));
    const numOfSafeCellsLeft = (mineData.length * mineData[0].length) - numOfMines; // intially All cells except number of mines
    this.state = {
      mineData,
      cellClick,
      numOfSafeCellsLeft,
      gameOver: false,
      gameWon: false
    }
    
  }

  handleCellClick = (rowIndex, cellIndex) => {
    if(this.state.gameOver || this.state.gameWon) {
      return;
    }
    let cellClick = this.state.cellClick;
    cellClick[rowIndex][cellIndex] = true; // mark the cell as visited

    let { gameWon, gameOver, numOfSafeCellsLeft}  = this.state;
    // check if user step on a mine
    if(this.isMine(this.state.mineData[rowIndex][cellIndex])) {
      gameOver = true;
    } else { // reduce the number of safe cells left in arena
      numOfSafeCellsLeft--;
    }
    // whether all safe cells are clicked, then game is won
    if(numOfSafeCellsLeft === 0) {
      gameWon = true;
      // display all the cells content, since game is won
      cellClick = new Array(this.state.mineData.length).fill(0).map(() => {
        return new Array(this.state.mineData[0].length).fill(true)
      });
    }
    this.setState({cellClick, gameOver, gameWon, numOfSafeCellsLeft});
  }

  isClicked = (rowIndex, cellIndex) => {
    return this.state.cellClick[rowIndex][cellIndex];
  }

  isMine = item => item === -1;

  reset = () => {
    const cellClick = new Array(this.state.mineData.length).fill(0).map(() => {
      return new Array(this.state.mineData[0].length).fill(false)
    });
    this.setState({cellClick, gameOver: false});
  }

  getResetButtonText = () => {
    let text = "Try not to touch a mine!";
    if(this.state.gameOver) {
      text = 'Boom! play again';
    }
    if(this.state.gameWon) {
      text = "You Won :)";
    }
    return text;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React - Project Set up is done using create-react-app tool</h2>
        </div>
        <div className="arena">
          { 
            this.state.mineData.map((row, rowIndex) => {
              return (<div key={rowIndex} className="row">
                {
                  row.map((item, cellIndex) => {
                    return (
                      <div key={cellIndex} className={this.isClicked(rowIndex, cellIndex) ? "column" : "column not-clicked"}
                        onClick={this.handleCellClick.bind(this, rowIndex, cellIndex)}>
                        <div className={this.isClicked(rowIndex, cellIndex) ? "cell" : "cell hidden"}>
                          {this.isMine(item) ? <img src={logo} className="mine" alt="M" /> : item}
                        </div>
                      </div>
                    )
                  })
                }
              </div>);
            })
          }
        </div>
        <button onClick={this.reset} disabled={!this.state.gameOver} className="resetButton">{this.getResetButtonText()}</button>
      </div>
    );
  }
}

export default App;
