import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import './App.css';

const COLUMNS = 30;
const ROWS = 20;
// NOTE: With react-bootstrap, width includes the borders
const CELL_WIDTH = 15;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      generation: 0,
      grid: Array(ROWS).fill(Array(COLUMNS).fill(false)),
      gameIsRunning: false
    };
  }

  gameIteration = () => {
    this.setState({ generation: this.state.generation + 1 });
  }

  handlePlayPause = () => {
    if (this.state.gameIsRunning) {
      clearInterval(this.intervalId);
    } else {
      this.intervalId = setInterval(this.gameIteration, 200);
    }

    this.setState({ gameIsRunning: !this.state.gameIsRunning });
  }

  handleReset = () => {
    clearInterval(this.intervalId);
    this.setState({
      generation: 0,
      grid: Array(ROWS).fill(Array(COLUMNS).fill(false)),
      gameIsRunning: false
    });
  }

  handleCellClick(i, j) {
    if (this.state.generation !== 0) { return; }

    var newGrid = cloneGrid(this.state.grid);
    newGrid[i][j] = !newGrid[i][j];
    this.setState({ grid: newGrid });
  }

  render() {
    return (
      <div className="App">
        <h1>{"Conway's Game of Life"}</h1>
        <div className="buttons">
          <ButtonToolbar>
            <Button onClick={this.handlePlayPause}>
              {this.state.gameIsRunning ? "Pause" : "Play"}
            </Button>
            <Button onClick={this.handleReset}>Reset</Button>
          </ButtonToolbar>
        </div>
        <Board grid={this.state.grid}
               handleCellClick={(i, j) => this.handleCellClick(i, j)}/>
        <h3>Generations: {this.state.generation}</h3>
      </div>
    );
  }
}

class Board extends React.Component {
  // We need this function to force i, j to be passed by value
  createClickHandler(i, j) {
    return () => this.props.handleCellClick(i, j);
  }

  render() {
    var cells = [];
    const rows = this.props.grid.length;
    const columns = this.props.grid[0].length;
    var width = columns * CELL_WIDTH;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        var cellClass = this.props.grid[i][j] ? "Cell on" : "Cell off";
        var cellKey = i + "_" + j;
        cells.push(<Cell height={CELL_WIDTH}
                         width={CELL_WIDTH}
                         cellClass={cellClass}
                         key={cellKey}
                         onClick={this.createClickHandler(i, j)} />);
      }
    }

    return (
      <div className="Board" style={{width: width}}>
        {cells}
      </div>
    );
  }
}

class Cell extends React.Component {
  render() {
    return (
      <div className={this.props.cellClass}
           style={{width: this.props.width, height: this.props.height}}
           onClick={this.props.onClick}
      />
    );
  }
}

function cloneGrid(grid) {
  var newGrid = [];
  for (var i = 0; i < grid.length; i++) {
    newGrid[i] = grid[i].slice();
  }
  return newGrid;
}

export default App;
