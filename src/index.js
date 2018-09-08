import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button
        className="square"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i, points) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i, points)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, {x: 1, y: 1})}
          {this.renderSquare(1, {x: 1, y: 2})}
          {this.renderSquare(2, {x: 1, y: 3})}
        </div>
        <div className="board-row">
          {this.renderSquare(3, {x: 2, y: 1})}
          {this.renderSquare(4, {x: 2, y: 2})}
          {this.renderSquare(5, {x: 2, y: 3})}
        </div>
        <div className="board-row">
          {this.renderSquare(6, {x: 3, y: 1})}
          {this.renderSquare(7, {x: 4, y: 2})}
          {this.renderSquare(8, {x: 5, y: 3})}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        points: {x: null, y: null}
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i, points) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.getNextPlayer()

    this.setState({
      history: history.concat([{
        squares: squares,
        points
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  getNextPlayer() {
    return this.state.xIsNext ? 'X' : 'O';
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move} (${step.points.x}, ${step.points.y})` :
        'Go to game start';
      return (
        <li
          key={move}
          className={move === this.state.stepNumber ? "selected" : ""}
        >
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + this.getNextPlayer();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, points) => this.handleClick(i, points)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
