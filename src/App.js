import React from 'react';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>Conway's Game of Life</h1>
        <Board />
        <p>Generations: 0</p>
      </div>
    );
  }
}

class Board extends React.Component {
  COLUMNS = 30;
  ROWS = 20;
  CELL_WIDTH = 15;
  CELL_BORDER = 1;

  render() {
    var cells = [];
    var width = this.COLUMNS * (this.CELL_WIDTH + 2*this.CELL_BORDER);
    for (var i = 0; i < this.ROWS; i++) {
      for (var j = 0; j < this.COLUMNS; j++) {
        cells.push(<Cell height={this.CELL_WIDTH} width={this.CELL_WIDTH}/>)
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
      <div className="Cell"
           style={{width: this.props.width, height: this.props.height}}
      />
    );
  }
}

export default App;
