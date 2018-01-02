import React from 'react';
import './App.css';

const COLUMNS = 30;
const ROWS = 20;
const CELL_WIDTH = 15;
const CELL_BORDER = 1;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      generation: 0,
      grid: Array(ROWS).fill(Array(COLUMNS).fill(false))
    };
  }

  render() {
    return (
      <div className="App">
        <h1>{"Conway's Game of Life"}</h1>
        <Board grid={this.state.grid}/>
        <p>Generations: {this.state.generation}</p>
      </div>
    );
  }
}

class Board extends React.Component {
  render() {
    var cells = [];
    const rows = this.props.grid.length;
    const columns = this.props.grid[0].length;
    var width = columns * (CELL_WIDTH + 2 * CELL_BORDER);
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        var cellClass = this.props.grid[i][j] ? "Cell on" : "Cell off";
        cells.push(<Cell height={CELL_WIDTH}
                         width={CELL_WIDTH}
                         cellClass={cellClass} />);
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
      />
    );
  }
}

export default App;
