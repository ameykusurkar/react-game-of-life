import React from 'react';
import { Button, DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';
import './App.css';

const COLUMNS = 50;
const ROWS = 30;
// NOTE: With react-bootstrap, width includes the borders
const CELL_WIDTH = 15;
const INTERVALS = { Slow: 500, Medium: 300, Fast: 150 }; // milliseconds

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      speed: "Fast",
      generation: 0,
      grid: Array(ROWS).fill().map(_ => Array(COLUMNS).fill(false)),
      gameIsRunning: false
    };
  }

  gameIteration = () => {
    var newGrid = Array(ROWS).fill().map(_ => []);

    for (var i = 0; i < ROWS; i++) {
      for (var j = 0; j < COLUMNS; j++) {
        var neighbours = getNeighbours(this.state.grid, i, j);

        if (this.state.grid[i][j]) {
          // A live cell lives on if it has 2 or 3 neighbours
          newGrid[i][j] = (neighbours === 2 || neighbours === 3);
        } else {
          // A dead cell becomes live if it has 3 neighbours
          newGrid[i][j] = (neighbours === 3);
        }
      }
    }

    this.setState({
      generation: this.state.generation + 1,
      grid: newGrid
    });
  }

  handlePlayPause = () => {
    if (this.state.gameIsRunning) {
      clearInterval(this.intervalId);
    } else {
      var interval = INTERVALS[this.state.speed] || 300;
      this.intervalId = setInterval(this.gameIteration, interval);
    }

    this.setState({ gameIsRunning: !this.state.gameIsRunning });
  }

  handleReset = () => {
    clearInterval(this.intervalId);
    this.setState({
      generation: 0,
      grid: Array(ROWS).fill().map(_ => Array(COLUMNS).fill(false)),
      gameIsRunning: false
    });
  }

  randomFillGrid = () => {
    var newGrid = Array(ROWS).fill().map(_ => []);

    for (var i = 0; i < ROWS; i++) {
      for (var j = 0; j < COLUMNS; j++) {
        newGrid[i][j] = Math.random() < 0.25;
      }
    }

    this.setState({ grid: newGrid });
  }

  changeSpeed = (eventKey) => {
    if (this.state.gameIsRunning) {
      clearInterval(this.intervalId);
      var interval = INTERVALS[eventKey] || 300;
      this.intervalId = setInterval(this.gameIteration, interval);
    }

    this.setState({ speed: eventKey });
  }

  handleCellClick(i, j) {
    if (this.state.gameIsRunning) { return; }

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
            <Button onClick={this.randomFillGrid}
                    disabled={this.state.gameIsRunning}>
              Random Fill
            </Button>
            <Button onClick={this.handlePlayPause}>
              {this.state.gameIsRunning ? "Pause" : "Play"}
            </Button>
            <Button onClick={this.handleReset}>Reset</Button>
            <DropdownButton title={this.state.speed} id="speedDropdown">
              <MenuItem eventKey="Slow"
                        onSelect={this.changeSpeed}
                        active={this.state.speed === "Slow"}>Slow</MenuItem>
              <MenuItem eventKey="Medium"
                        onSelect={this.changeSpeed}
                        active={this.state.speed === "Medium"}>Medium</MenuItem>
              <MenuItem eventKey="Fast"
                        onSelect={this.changeSpeed}
                        active={this.state.speed === "Fast"}>Fast</MenuItem>
            </DropdownButton>
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

function Cell(props) {
  return (
    <div className={props.cellClass}
         style={{width: props.width, height: props.height}}
         onClick={props.onClick} />
  );
}

function getNeighbours(grid, x, y) {
  var counter = 0;
  for (var i = x - 1; i <= x + 1; i++) {
    for (var j = y - 1; j <= y + 1; j++) {
      if ((i !== x || j !== y) && cellIsLive(grid, i, j)) {
        counter++;
      }
    }
  }
  return counter;
}

function cellIsLive(grid, x, y) {
  if (x < 0 || x >= grid.length) return false;
  return grid[x][y];
}

function cloneGrid(grid) {
  var newGrid = [];
  for (var i = 0; i < grid.length; i++) {
    newGrid[i] = grid[i].slice();
  }
  return newGrid;
}

export default App;
