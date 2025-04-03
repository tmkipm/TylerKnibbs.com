'use client';

import React, { useState, useEffect, useRef } from 'react';
import './chess.css';

// Chess piece type
type Piece = {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: 'white' | 'black';
  hasMoved?: boolean;
};

// Position on the board
type Position = {
  row: number;
  col: number;
};

// Add AI configuration type
type AIDifficulty = 'easy' | 'medium' | 'hard';

type AIConfig = {
  enabled: boolean;
  difficulty: AIDifficulty;
  thinking: boolean;
};

// Game state
type GameState = {
  board: (Piece | null)[][];
  currentPlayer: 'white' | 'black';
  selectedPiece: Position | null;
  validMoves: Position[];
  capturedPieces: {
    white: Piece[];
    black: Piece[];
  };
  check: 'white' | 'black' | null;
  checkmate: 'white' | 'black' | null;
  gameHistory: {
    from: Position;
    to: Position;
    piece: Piece;
    captured?: Piece;
  }[];
};

const ChessGame: React.FC = () => {
  // Initialize the game state
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(),
    currentPlayer: 'white',
    selectedPiece: null,
    validMoves: [],
    capturedPieces: {
      white: [],
      black: []
    },
    check: null,
    checkmate: null,
    gameHistory: []
  });

  // Optional settings
  const [showValidMoves, setShowValidMoves] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');

  // Add AI state
  const [aiConfig, setAIConfig] = useState<AIConfig>({
    enabled: false,
    difficulty: 'medium',
    thinking: false
  });

  // Add piece value constants for AI evaluation
  const PIECE_VALUES = {
    pawn: 100,
    knight: 320,
    bishop: 330, 
    rook: 500,
    queen: 900,
    king: 20000
  };

  // Create a timeout reference for AI moves
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define simple opening book for common first moves
  const OPENING_BOOK: Record<string, { from: Position; to: Position }[]> = {
    // Initial position responses
    'empty': [
      { from: { row: 1, col: 4 }, to: { row: 3, col: 4 } }, // e2-e4
      { from: { row: 1, col: 3 }, to: { row: 3, col: 3 } }, // d2-d4
      { from: { row: 0, col: 1 }, to: { row: 2, col: 2 } }  // Nb1-c3
    ],
    // Responses to e4
    'e4': [
      { from: { row: 6, col: 4 }, to: { row: 4, col: 4 } }, // e7-e5
      { from: { row: 6, col: 2 }, to: { row: 4, col: 2 } }, // c7-c5 (Sicilian)
      { from: { row: 7, col: 1 }, to: { row: 5, col: 2 } }  // Nb8-c6
    ],
    // Responses to d4
    'd4': [
      { from: { row: 6, col: 3 }, to: { row: 4, col: 3 } }, // d7-d5
      { from: { row: 6, col: 5 }, to: { row: 4, col: 5 } }, // f7-f5
      { from: { row: 7, col: 6 }, to: { row: 5, col: 5 } }  // Ng8-f6
    ],
    // Default moves
    'unknown': [
      { from: { row: 7, col: 6 }, to: { row: 5, col: 5 } }, // Ng8-f6
      { from: { row: 6, col: 4 }, to: { row: 4, col: 4 } }  // e7-e5  
    ]
  };

  // Add current evaluation state
  const [evaluation, setEvaluation] = useState<number>(0);

  // Initialize the chess board
  function initializeBoard(): (Piece | null)[][] {
    const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

    // Set up pawns
    for (let col = 0; col < 8; col++) {
      board[1][col] = { type: 'pawn', color: 'black' };
      board[6][col] = { type: 'pawn', color: 'white' };
    }

    // Set up rooks
    board[0][0] = { type: 'rook', color: 'black' };
    board[0][7] = { type: 'rook', color: 'black' };
    board[7][0] = { type: 'rook', color: 'white' };
    board[7][7] = { type: 'rook', color: 'white' };

    // Set up knights
    board[0][1] = { type: 'knight', color: 'black' };
    board[0][6] = { type: 'knight', color: 'black' };
    board[7][1] = { type: 'knight', color: 'white' };
    board[7][6] = { type: 'knight', color: 'white' };

    // Set up bishops
    board[0][2] = { type: 'bishop', color: 'black' };
    board[0][5] = { type: 'bishop', color: 'black' };
    board[7][2] = { type: 'bishop', color: 'white' };
    board[7][5] = { type: 'bishop', color: 'white' };

    // Set up queens
    board[0][3] = { type: 'queen', color: 'black' };
    board[7][3] = { type: 'queen', color: 'white' };

    // Set up kings
    board[0][4] = { type: 'king', color: 'black' };
    board[7][4] = { type: 'king', color: 'white' };

    return board;
  }

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    // Prevent user from moving pieces when it's AI's turn
    if (aiConfig.enabled && gameState.currentPlayer === 'black') {
      return;
    }

    // Deep clone the current game state to avoid direct mutation
    const newGameState = JSON.parse(JSON.stringify(gameState)) as GameState;
    const { board, currentPlayer, selectedPiece } = newGameState;
    
    // If a piece is already selected
    if (selectedPiece) {
      // Check if the clicked square is a valid move
      const isValidMove = newGameState.validMoves.some(
        move => move.row === row && move.col === col
      );

      if (isValidMove) {
        // Store the move in history
        const piece = board[selectedPiece.row][selectedPiece.col]!;
        const captured = board[row][col];
        
        newGameState.gameHistory.push({
          from: { ...selectedPiece },
          to: { row, col },
          piece: { ...piece },
          captured: captured ? { ...captured } : undefined
        });

        // If capturing a piece, add it to captured pieces
        if (captured) {
          newGameState.capturedPieces[captured.color].push({ ...captured });
        }

        // Move the piece
        board[row][col] = board[selectedPiece.row][selectedPiece.col];
        board[selectedPiece.row][selectedPiece.col] = null;
        
        // Mark that the piece has moved (for special moves like castling)
        if (board[row][col]) {
          board[row][col]!.hasMoved = true;
        }

        // Check for pawn promotion
        if (board[row][col]?.type === 'pawn') {
          if ((board[row][col]?.color === 'white' && row === 0) || 
              (board[row][col]?.color === 'black' && row === 7)) {
            // Auto-promote to queen for simplicity
            board[row][col]!.type = 'queen';
          }
        }

        // Switch player
        newGameState.currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
        newGameState.selectedPiece = null;
        newGameState.validMoves = [];

        // Check for check or checkmate
        const checkStatus = isKingInCheck(board, newGameState.currentPlayer);
        newGameState.check = checkStatus ? newGameState.currentPlayer : null;
        
        if (checkStatus) {
          const hasValidMoves = hasAnyValidMoves(board, newGameState.currentPlayer);
          if (!hasValidMoves) {
            newGameState.checkmate = newGameState.currentPlayer;
          }
        }

        setGameState(newGameState);
      } else {
        // If clicking on own piece, select that piece instead
        const clickedPiece = board[row][col];
        if (clickedPiece && clickedPiece.color === currentPlayer) {
          newGameState.selectedPiece = { row, col };
          newGameState.validMoves = getValidMoves(board, row, col);
          setGameState(newGameState);
        } else {
          // If clicking on an invalid square, deselect
          newGameState.selectedPiece = null;
          newGameState.validMoves = [];
          setGameState(newGameState);
        }
      }
    } else {
      // No piece selected yet, try to select one
      const clickedPiece = board[row][col];
      if (clickedPiece && clickedPiece.color === currentPlayer) {
        newGameState.selectedPiece = { row, col };
        newGameState.validMoves = getValidMoves(board, row, col);
        setGameState(newGameState);
      }
    }
  };

  // Get valid moves for a piece
  const getValidMoves = (board: (Piece | null)[][], row: number, col: number): Position[] => {
    const piece = board[row][col];
    if (!piece) return [];

    let moves: Position[] = [];

    switch (piece.type) {
      case 'pawn':
        moves = getPawnMoves(board, row, col, piece.color);
        break;
      case 'rook':
        moves = getRookMoves(board, row, col, piece.color);
        break;
      case 'knight':
        moves = getKnightMoves(board, row, col, piece.color);
        break;
      case 'bishop':
        moves = getBishopMoves(board, row, col, piece.color);
        break;
      case 'queen':
        moves = [
          ...getRookMoves(board, row, col, piece.color),
          ...getBishopMoves(board, row, col, piece.color)
        ];
        break;
      case 'king':
        moves = getKingMoves(board, row, col, piece.color);
        break;
    }

    // Filter moves that would put or leave the king in check
    return moves.filter(move => {
      const tempBoard = JSON.parse(JSON.stringify(board));
      tempBoard[move.row][move.col] = tempBoard[row][col];
      tempBoard[row][col] = null;
      return !isKingInCheck(tempBoard, piece.color);
    });
  };

  // Move generators for each piece type
  const getPawnMoves = (board: (Piece | null)[][], row: number, col: number, color: 'white' | 'black'): Position[] => {
    const moves: Position[] = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;

    // Move forward one square
    if (isInBounds(row + direction, col) && !board[row + direction][col]) {
      moves.push({ row: row + direction, col });

      // Move forward two squares from starting position
      if (row === startRow && !board[row + 2 * direction][col]) {
        moves.push({ row: row + 2 * direction, col });
      }
    }

    // Capture diagonally
    const captureMoves = [
      { row: row + direction, col: col - 1 },
      { row: row + direction, col: col + 1 }
    ];

    captureMoves.forEach(move => {
      if (isInBounds(move.row, move.col) && 
          board[move.row][move.col] && 
          board[move.row][move.col]?.color !== color) {
        moves.push(move);
      }
    });

    return moves;
  };

  const getRookMoves = (board: (Piece | null)[][], row: number, col: number, color: 'white' | 'black'): Position[] => {
    const moves: Position[] = [];
    const directions = [
      { row: 0, col: 1 },  // right
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }, // left
      { row: -1, col: 0 }  // up
    ];

    directions.forEach(dir => {
      let currentRow = row + dir.row;
      let currentCol = col + dir.col;

      while (isInBounds(currentRow, currentCol)) {
        if (!board[currentRow][currentCol]) {
          // Empty square
          moves.push({ row: currentRow, col: currentCol });
        } else if (board[currentRow][currentCol]?.color !== color) {
          // Capture opponent piece
          moves.push({ row: currentRow, col: currentCol });
          break;
        } else {
          // Own piece
          break;
        }
        currentRow += dir.row;
        currentCol += dir.col;
      }
    });

    return moves;
  };

  const getKnightMoves = (board: (Piece | null)[][], row: number, col: number, color: 'white' | 'black'): Position[] => {
    const moves: Position[] = [];
    const possibleMoves = [
      { row: row - 2, col: col - 1 },
      { row: row - 2, col: col + 1 },
      { row: row - 1, col: col - 2 },
      { row: row - 1, col: col + 2 },
      { row: row + 1, col: col - 2 },
      { row: row + 1, col: col + 2 },
      { row: row + 2, col: col - 1 },
      { row: row + 2, col: col + 1 }
    ];

    possibleMoves.forEach(move => {
      if (isInBounds(move.row, move.col) && 
          (!board[move.row][move.col] || board[move.row][move.col]?.color !== color)) {
        moves.push(move);
      }
    });

    return moves;
  };

  const getBishopMoves = (board: (Piece | null)[][], row: number, col: number, color: 'white' | 'black'): Position[] => {
    const moves: Position[] = [];
    const directions = [
      { row: 1, col: 1 },   // down-right
      { row: 1, col: -1 },  // down-left
      { row: -1, col: 1 },  // up-right
      { row: -1, col: -1 }  // up-left
    ];

    directions.forEach(dir => {
      let currentRow = row + dir.row;
      let currentCol = col + dir.col;

      while (isInBounds(currentRow, currentCol)) {
        if (!board[currentRow][currentCol]) {
          // Empty square
          moves.push({ row: currentRow, col: currentCol });
        } else if (board[currentRow][currentCol]?.color !== color) {
          // Capture opponent piece
          moves.push({ row: currentRow, col: currentCol });
          break;
        } else {
          // Own piece
          break;
        }
        currentRow += dir.row;
        currentCol += dir.col;
      }
    });

    return moves;
  };

  const getKingMoves = (board: (Piece | null)[][], row: number, col: number, color: 'white' | 'black'): Position[] => {
    const moves: Position[] = [];
    
    // All 8 possible directions for king
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue; // Skip the current position
        
        const newRow = row + i;
        const newCol = col + j;
        
        if (isInBounds(newRow, newCol) && 
            (!board[newRow][newCol] || board[newRow][newCol]?.color !== color)) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    // Castling logic
    if (!board[row][col]?.hasMoved) {
      // Kingside castling
      if (!board[row][col+1] && !board[row][col+2] && 
          board[row][col+3]?.type === 'rook' && !board[row][col+3]?.hasMoved) {
        moves.push({ row, col: col + 2 });
      }
      
      // Queenside castling
      if (!board[row][col-1] && !board[row][col-2] && !board[row][col-3] && 
          board[row][col-4]?.type === 'rook' && !board[row][col-4]?.hasMoved) {
        moves.push({ row, col: col - 2 });
      }
    }

    return moves;
  };

  // Helper function to check if a position is within the board
  const isInBounds = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  // Check if a king is in check
  const isKingInCheck = (board: (Piece | null)[][], kingColor: 'white' | 'black'): boolean => {
    // Find the king
    let kingRow = -1;
    let kingCol = -1;
    
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c]?.type === 'king' && board[r][c]?.color === kingColor) {
          kingRow = r;
          kingCol = c;
          break;
        }
      }
      if (kingRow !== -1) break;
    }

    // Check if any opponent piece can capture the king
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.color !== kingColor) {
          const moves = getBasicMoves(board, r, c);
          if (moves.some(move => move.row === kingRow && move.col === kingCol)) {
            return true;
          }
        }
      }
    }

    return false;
  };

  // Get moves without checking if they would put the king in check
  const getBasicMoves = (board: (Piece | null)[][], row: number, col: number): Position[] => {
    const piece = board[row][col];
    if (!piece) return [];

    switch (piece.type) {
      case 'pawn':
        return getPawnMoves(board, row, col, piece.color);
      case 'rook':
        return getRookMoves(board, row, col, piece.color);
      case 'knight':
        return getKnightMoves(board, row, col, piece.color);
      case 'bishop':
        return getBishopMoves(board, row, col, piece.color);
      case 'queen':
        return [
          ...getRookMoves(board, row, col, piece.color),
          ...getBishopMoves(board, row, col, piece.color)
        ];
      case 'king':
        return getKingMoves(board, row, col, piece.color);
      default:
        return [];
    }
  };

  // Check if player has any valid moves
  const hasAnyValidMoves = (board: (Piece | null)[][], playerColor: 'white' | 'black'): boolean => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.color === playerColor) {
          const validMoves = getValidMoves(board, r, c);
          if (validMoves.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Restart the game
  const restartGame = () => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
    
    setGameState({
      board: initializeBoard(),
      currentPlayer: 'white',
      selectedPiece: null,
      validMoves: [],
      capturedPieces: {
        white: [],
        black: []
      },
      check: null,
      checkmate: null,
      gameHistory: []
    });
    
    setAIConfig(prev => ({ ...prev, thinking: false }));
  };

  // Flip the board orientation
  const flipBoard = () => {
    setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white');
  };

  // Toggle AI opponent
  const toggleAI = () => {
    console.log('Toggle AI called, current state:', aiConfig.enabled);
    
    // If turning AI on and it's black's turn, trigger AI move
    const willEnableAI = !aiConfig.enabled;
    
    setAIConfig(prev => {
      const newConfig = { 
        ...prev, 
        enabled: !prev.enabled,
        thinking: false
      };
      console.log('New AI config:', newConfig);
      return newConfig;
    });
    
    // Schedule AI move if turning on and it's black's turn
    if (willEnableAI && gameState.currentPlayer === 'black') {
      console.log('AI enabled while it\'s black\'s turn, scheduling AI move');
      setTimeout(() => {
        makeAIMove();
      }, 100);
    }
  };
  
  // Change AI difficulty
  const changeDifficulty = (difficulty: AIDifficulty) => {
    console.log('Changing AI difficulty to:', difficulty);
    setAIConfig(prev => ({ 
      ...prev, 
      difficulty,
      // If turning on AI at the same time as changing difficulty
      enabled: prev.enabled || true
    }));
    
    // If it's the AI's turn, schedule a move with the new difficulty
    if (gameState.currentPlayer === 'black') {
      setTimeout(() => {
        makeAIMove();
      }, 200);
    }
  };

  // Render chess pieces with Unicode characters
  const renderPiece = (piece: Piece | null): string => {
    if (!piece) return '';
    
    const pieces = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };
    
    return pieces[piece.color][piece.type];
  };

  // Render the chess board
  const renderBoard = () => {
    const rows = boardOrientation === 'white' 
      ? [...Array(8).keys()]
      : [...Array(8).keys()].reverse();
    
    const cols = boardOrientation === 'white'
      ? [...Array(8).keys()]
      : [...Array(8).keys()].reverse();

    return (
      <div className="chess-board">
        {showCoordinates && (
          <div className="col-coordinates">
            {cols.map(col => (
              <div key={`col-${col}`} className="coordinate">
                {String.fromCharCode(97 + col)}
              </div>
            ))}
          </div>
        )}
        <div className="board-container">
          {showCoordinates && (
            <div className="row-coordinates">
              {rows.map(row => (
                <div key={`row-${row}`} className="coordinate">
                  {8 - row}
                </div>
              ))}
            </div>
          )}
          <div className="board">
            {rows.map(row => (
              <div key={`row-${row}`} className="board-row">
                {cols.map(col => {
                  const actualRow = boardOrientation === 'white' ? row : 7 - row;
                  const actualCol = boardOrientation === 'white' ? col : 7 - col;
                  const isSelected = gameState.selectedPiece?.row === actualRow && gameState.selectedPiece?.col === actualCol;
                  const isValidMove = gameState.validMoves.some(move => move.row === actualRow && move.col === actualCol);
                  const piece = gameState.board[actualRow][actualCol];
                  const isDarkSquare = (actualRow + actualCol) % 2 === 1;

                  return (
                    <div 
                      key={`square-${actualRow}-${actualCol}`}
                      className={`
                        square 
                        ${isDarkSquare ? 'dark' : 'light'}
                        ${isSelected ? 'selected' : ''}
                        ${isValidMove && showValidMoves ? 'valid-move' : ''}
                      `}
                      onClick={() => handleSquareClick(actualRow, actualCol)}
                    >
                      <div className="piece">{renderPiece(piece)}</div>
                      {isValidMove && showValidMoves && (
                        <div className="valid-move-indicator"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render captured pieces with material count
  const renderCapturedPieces = () => {
    // Calculate total material value for each player's captured pieces
    const getValueSum = (pieces: Piece[]): number => {
      return pieces.reduce((sum, piece) => sum + PIECE_VALUES[piece.type], 0);
    };
    
    const whiteCapturedValue = getValueSum(gameState.capturedPieces.white);
    const blackCapturedValue = getValueSum(gameState.capturedPieces.black);
    
    // Calculate material advantage
    const whiteMaterialAdvantage = blackCapturedValue - whiteCapturedValue;
    
    return (
      <div className="control-panel captured-panel">
        <h3 className="panel-title">Captured Pieces</h3>
        
        {whiteMaterialAdvantage !== 0 && (
          <div className="material-advantage">
            Advantage: {whiteMaterialAdvantage > 0 ? 'White' : 'Black'} 
            <span className="advantage-value">(+{Math.abs(whiteMaterialAdvantage)/100})</span>
          </div>
        )}
        
        <div className="captured-section">
          <div className="captured-header">
            <span className="player-label white">White:</span>
            {blackCapturedValue > 0 && <span className="material-value">+{(blackCapturedValue/100).toFixed(1)}</span>}
          </div>
          <div className="captured-list">
            {gameState.capturedPieces.white.length === 0 ? (
              <div className="no-captures">No captures</div>
            ) : (
              gameState.capturedPieces.white.map((piece, index) => (
                <div key={`captured-white-${index}`} className="captured-piece">
                  {renderPiece(piece)}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="captured-section">
          <div className="captured-header">
            <span className="player-label black">Black:</span>
            {whiteCapturedValue > 0 && <span className="material-value">+{(whiteCapturedValue/100).toFixed(1)}</span>}
          </div>
          <div className="captured-list">
            {gameState.capturedPieces.black.length === 0 ? (
              <div className="no-captures">No captures</div>
            ) : (
              gameState.capturedPieces.black.map((piece, index) => (
                <div key={`captured-black-${index}`} className="captured-piece">
                  {renderPiece(piece)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // Helper function to convert move to proper chess notation
  const moveToNotation = (from: Position, to: Position, piece: Piece, captured?: Piece | null, isCheck: boolean = false, isCheckmate: boolean = false): string => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const toStr = files[to.col] + ranks[to.row];
    
    // Map pieces to their notation symbols
    const pieceSymbols: Record<string, string> = {
      'pawn': '',
      'knight': 'N',
      'bishop': 'B',
      'rook': 'R',
      'queen': 'Q',
      'king': 'K'
    };
    
    // Basic notation with piece symbol
    let notation = piece.type === 'pawn' ? '' : pieceSymbols[piece.type];
    
    // Add capture symbol if needed
    if (captured) {
      // For pawns, include the source file when capturing
      if (piece.type === 'pawn') {
        notation += files[from.col];
      }
      notation += 'x';
    }
    
    // Add destination square
    notation += toStr;
    
    // Add check or checkmate symbol
    if (isCheckmate) {
      notation += '#';
    } else if (isCheck) {
      notation += '+';
    }
    
    return notation;
  };

  // Modified renderGameInfo function with a cleaner menu structure
  const renderGameInfo = () => {
    return (
      <div className="game-info">
        <div className="status-container">
          <div className="status">
            {gameState.checkmate ? (
              <div className="game-result">
                <span className="checkmate-text">Checkmate!</span> 
                <span className="winner">{gameState.checkmate === 'white' ? 'Black' : 'White'} wins</span>
              </div>
            ) : (
              <>
                <div className="current-turn">
                  <div className={`turn-indicator ${gameState.currentPlayer}`}></div>
                  <span>{gameState.currentPlayer === 'white' ? 'White' : 'Black'} to move</span>
                </div>
                {gameState.check && (
                  <div className="check-alert">
                    {gameState.check === 'white' ? 'White' : 'Black'} is in check!
                  </div>
                )}
              </>
            )}
            {aiConfig.thinking && <div className="ai-thinking">AI is thinking...</div>}
          </div>
          
          {/* Evaluation bar */}
          <div className="evaluation-bar-container">
            <div 
              className="evaluation-bar"
              style={{ 
                transform: `translateY(${Math.min(Math.max(-evaluation / 20, -100), 100) * 0.5}%)`,
                backgroundColor: evaluation > 0 ? '#fff' : '#000',
                color: evaluation > 0 ? '#000' : '#fff'
              }}
            >
              {Math.abs(evaluation) > 2 && (evaluation / 100).toFixed(1)}
            </div>
          </div>
        </div>
        
        {/* Control panels */}
        <div className="control-panels">
          {/* Game control panel */}
          <div className="control-panel">
            <h3 className="panel-title">Game Controls</h3>
            <div className="game-controls">
              <button onClick={restartGame}>New Game</button>
              <button onClick={flipBoard}>Flip Board</button>
            </div>
            <div className="game-controls secondary">
              <button onClick={() => setShowValidMoves(!showValidMoves)}>
                {showValidMoves ? 'Hide Moves' : 'Show Moves'}
              </button>
              <button onClick={() => setShowCoordinates(!showCoordinates)}>
                {showCoordinates ? 'Hide Coords' : 'Show Coords'}
              </button>
            </div>
          </div>
          
          {/* AI control panel */}
          <div className="control-panel">
            <h3 className="panel-title">AI Opponent</h3>
            <div className="ai-toggle">
              <button 
                onClick={toggleAI}
                className={aiConfig.enabled ? 'active' : ''}
              >
                {aiConfig.enabled ? 'AI: ON' : 'AI: OFF'}
              </button>
            </div>
            
            {aiConfig.enabled && (
              <div className="ai-difficulty">
                <p>Difficulty:</p>
                <div className="difficulty-options">
                  <button 
                    onClick={() => changeDifficulty('easy')}
                    className={aiConfig.difficulty === 'easy' ? 'active' : ''}
                  >
                    Easy
                  </button>
                  <button 
                    onClick={() => changeDifficulty('medium')}
                    className={aiConfig.difficulty === 'medium' ? 'active' : ''}
                  >
                    Medium
                  </button>
                  <button 
                    onClick={() => changeDifficulty('hard')}
                    className={aiConfig.difficulty === 'hard' ? 'active' : ''}
                  >
                    Hard
                  </button>
                </div>
              </div>
            )}
            
            {aiConfig.enabled && (
              <div className="ai-status-info">
                Playing as White against AI (Black)
              </div>
            )}
          </div>
        </div>
        
        {/* Move history */}
        <div className="move-history-panel">
          <h3 className="panel-title">Move History</h3>
          <div className="move-history">
            <div className="move-list">
              {gameState.gameHistory.length === 0 ? (
                <p className="no-moves">No moves yet</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>White</th>
                      <th>Black</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.ceil(gameState.gameHistory.length / 2) }).map((_, idx) => {
                      const whiteMove = gameState.gameHistory[idx * 2];
                      const blackMove = gameState.gameHistory[idx * 2 + 1];
                      
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}.</td>
                          <td>
                            {whiteMove && moveToNotation(
                              whiteMove.from, 
                              whiteMove.to, 
                              whiteMove.piece, 
                              whiteMove.captured,
                              // Check if this move put the opponent in check
                              idx * 2 + 1 < gameState.gameHistory.length && gameState.check === 'black',
                              idx * 2 + 1 < gameState.gameHistory.length && gameState.checkmate === 'black'
                            )}
                          </td>
                          <td>
                            {blackMove && moveToNotation(
                              blackMove.from,
                              blackMove.to,
                              blackMove.piece,
                              blackMove.captured,
                              // Check if this move put the opponent in check
                              idx * 2 + 2 < gameState.gameHistory.length && gameState.check === 'white',
                              idx * 2 + 2 < gameState.gameHistory.length && gameState.checkmate === 'white'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update the evaluateBoard function to also set the evaluation state
  const evaluateBoard = (board: (Piece | null)[][], currentTurn: 'white' | 'black'): number => {
    let score = 0;
    
    // Piece-square tables for positional evaluation
    const pawnTable = [
      [0,  0,  0,  0,  0,  0,  0,  0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [5,  5, 10, 25, 25, 10,  5,  5],
      [0,  0,  0, 20, 20,  0,  0,  0],
      [5, -5,-10,  0,  0,-10, -5,  5],
      [5, 10, 10,-20,-20, 10, 10,  5],
      [0,  0,  0,  0,  0,  0,  0,  0]
    ];
    
    const knightTable = [
      [-50,-40,-30,-30,-30,-30,-40,-50],
      [-40,-20,  0,  0,  0,  0,-20,-40],
      [-30,  0, 10, 15, 15, 10,  0,-30],
      [-30,  5, 15, 20, 20, 15,  5,-30],
      [-30,  0, 15, 20, 20, 15,  0,-30],
      [-30,  5, 10, 15, 15, 10,  5,-30],
      [-40,-20,  0,  5,  5,  0,-20,-40],
      [-50,-40,-30,-30,-30,-30,-40,-50]
    ];
    
    const bishopTable = [
      [-20,-10,-10,-10,-10,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0, 10, 10, 10, 10,  0,-10],
      [-10,  5,  5, 10, 10,  5,  5,-10],
      [-10,  0, 10, 10, 10, 10,  0,-10],
      [-10, 10, 10, 10, 10, 10, 10,-10],
      [-10,  5,  0,  0,  0,  0,  5,-10],
      [-20,-10,-10,-10,-10,-10,-10,-20]
    ];
    
    const rookTable = [
      [0,  0,  0,  0,  0,  0,  0,  0],
      [5, 10, 10, 10, 10, 10, 10,  5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [0,  0,  0,  5,  5,  0,  0,  0]
    ];
    
    const queenTable = [
      [-20,-10,-10, -5, -5,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5,  5,  5,  5,  0,-10],
      [-5,  0,  5,  5,  5,  5,  0, -5],
      [0,  0,  5,  5,  5,  5,  0, -5],
      [-10,  5,  5,  5,  5,  5,  0,-10],
      [-10,  0,  5,  0,  0,  0,  0,-10],
      [-20,-10,-10, -5, -5,-10,-10,-20]
    ];
    
    const kingMiddleTable = [
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-20,-30,-30,-40,-40,-30,-30,-20],
      [-10,-20,-20,-20,-20,-20,-20,-10],
      [20, 20,  0,  0,  0,  0, 20, 20],
      [20, 30, 10,  0,  0, 10, 30, 20]
    ];
    
    const kingEndTable = [
      [-50,-40,-30,-20,-20,-30,-40,-50],
      [-30,-20,-10,  0,  0,-10,-20,-30],
      [-30,-10, 20, 30, 30, 20,-10,-30],
      [-30,-10, 30, 40, 40, 30,-10,-30],
      [-30,-10, 30, 40, 40, 30,-10,-30],
      [-30,-10, 20, 30, 30, 20,-10,-30],
      [-30,-30,  0,  0,  0,  0,-30,-30],
      [-50,-30,-30,-30,-30,-30,-30,-50]
    ];
    
    // Material count and piece position evaluation
    let whiteMaterial = 0;
    let blackMaterial = 0;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (!piece) continue;
        
        const pieceValue = PIECE_VALUES[piece.type];
        
        // Count material
        if (piece.color === 'white') {
          whiteMaterial += pieceValue;
        } else {
          blackMaterial += pieceValue;
        }
        
        // Add positional bonus based on piece-square tables
        if (piece.color === 'white') {
          switch (piece.type) {
            case 'pawn':
              score += pawnTable[row][col];
              break;
            case 'knight':
              score += knightTable[row][col];
              break;
            case 'bishop':
              score += bishopTable[row][col];
              break;
            case 'rook':
              score += rookTable[row][col];
              break;
            case 'queen':
              score += queenTable[row][col];
              break;
            case 'king':
              // Use different tables for middle/endgame
              const isEndgame = whiteMaterial + blackMaterial < 3000;
              score += isEndgame ? kingEndTable[row][col] : kingMiddleTable[row][col];
              break;
          }
        } else {
          // For black, flip the tables (index 7 - row)
          switch (piece.type) {
            case 'pawn':
              score -= pawnTable[7 - row][col];
              break;
            case 'knight':
              score -= knightTable[7 - row][col];
              break;
            case 'bishop':
              score -= bishopTable[7 - row][col];
              break;
            case 'rook':
              score -= rookTable[7 - row][col];
              break;
            case 'queen':
              score -= queenTable[7 - row][col];
              break;
            case 'king':
              // Use different tables for middle/endgame
              const isEndgame = whiteMaterial + blackMaterial < 3000;
              score -= isEndgame ? kingEndTable[7 - row][col] : kingMiddleTable[7 - row][col];
              break;
          }
        }
      }
    }
    
    // Add material score
    score += whiteMaterial - blackMaterial;
    
    // Evaluate mobility (number of possible moves)
    let whiteMobility = 0;
    let blackMobility = 0;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (!piece) continue;
        
        const moves = getBasicMoves(board, row, col);
        if (piece.color === 'white') {
          whiteMobility += moves.length;
        } else {
          blackMobility += moves.length;
        }
      }
    }
    
    // Add mobility bonus (small factor to not overpower material)
    score += (whiteMobility - blackMobility) * 2;
    
    // Calculate final score
    const finalScore = score;
    
    // Set evaluation state for UI
    if (gameState.currentPlayer === currentTurn) {
      setEvaluation(finalScore);
    }
    
    return finalScore;
  };

  // Add minimax algorithm with alpha-beta pruning
  const minimax = (
    board: (Piece | null)[][], 
    depth: number, 
    alpha: number, 
    beta: number, 
    isMaximizing: boolean,
    color: 'white' | 'black'
  ): number => {
    // Base case: leaf node or maximum depth
    if (depth === 0) {
      return evaluateBoard(board, color);
    }

    // Check for checkmate or stalemate
    const hasValidMoves = hasAnyValidMoves(board, color);
    if (!hasValidMoves) {
      const inCheck = isKingInCheck(board, color);
      if (inCheck) {
        // Checkmate (worst outcome for the current player)
        return color === 'white' ? -100000 : 100000;
      } else {
        // Stalemate (draw)
        return 0;
      }
    }

    // Get all possible moves for the current player
    let allMoves: { piece: Position; move: Position }[] = [];

    // Collect all possible moves
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === color) {
          const validMoves = getValidMoves(board, row, col);
          validMoves.forEach(move => {
            allMoves.push({
              piece: { row, col },
              move
            });
          });
        }
      }
    }

    // Maximizing player (white)
    if (isMaximizing) {
      let maxEval = -Infinity;
      
      for (const { piece, move } of allMoves) {
        // Make move
        const newBoard = JSON.parse(JSON.stringify(board));
        const capturedPiece = newBoard[move.row][move.col];
        newBoard[move.row][move.col] = newBoard[piece.row][piece.col];
        newBoard[piece.row][piece.col] = null;
        
        // Recursive evaluation
        const evalScore = minimax(
          newBoard, 
          depth - 1, 
          alpha, 
          beta, 
          false, 
          'black'
        );
        
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        
        // Alpha-beta pruning
        if (beta <= alpha) {
          break;
        }
      }
      
      return maxEval;
    } 
    // Minimizing player (black)
    else {
      let minEval = Infinity;
      
      for (const { piece, move } of allMoves) {
        // Make move
        const newBoard = JSON.parse(JSON.stringify(board));
        const capturedPiece = newBoard[move.row][move.col];
        newBoard[move.row][move.col] = newBoard[piece.row][piece.col];
        newBoard[piece.row][piece.col] = null;
        
        // Recursive evaluation
        const evalScore = minimax(
          newBoard, 
          depth - 1, 
          alpha, 
          beta, 
          true, 
          'white'
        );
        
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        
        // Alpha-beta pruning
        if (beta <= alpha) {
          break;
        }
      }
      
      return minEval;
    }
  };

  // Count moves played to determine if we're in the opening
  const getMoveCount = (history: any[]): number => {
    return history.length;
  };

  // Generate an opening key based on the last move
  const getOpeningKey = (history: any[]): string => {
    if (history.length === 0) return 'empty';
    
    const lastMove = history[history.length - 1];
    
    // Simple encoding for common openings
    if (lastMove.from.row === 6 && lastMove.from.col === 4 && lastMove.to.row === 4 && lastMove.to.col === 4) {
      return 'e5'; // Respond to e7-e5
    }
    if (lastMove.from.row === 1 && lastMove.from.col === 4 && lastMove.to.row === 3 && lastMove.to.col === 4) {
      return 'e4'; // Respond to e2-e4
    }
    if (lastMove.from.row === 1 && lastMove.from.col === 3 && lastMove.to.row === 3 && lastMove.to.col === 3) {
      return 'd4'; // Respond to d2-d4
    }
    
    return 'unknown';
  };

  // Enhanced findBestMove with opening book and iterative deepening
  const findBestMove = (board: (Piece | null)[][], color: 'white' | 'black'): { from: Position; to: Position } | null => {
    // Check if we should use opening book (first few moves)
    const moveCount = getMoveCount(gameState.gameHistory);
    
    if (moveCount < 6) { // Still in opening phase
      const openingKey = getOpeningKey(gameState.gameHistory);
      const bookMoves = OPENING_BOOK[openingKey] || OPENING_BOOK['unknown'];
      
      // Find valid book moves
      for (const bookMove of bookMoves) {
        // Adjust for black's perspective if needed
        const adjustedMove = color === 'black' ? bookMove : bookMove;
        
        // Check if move is valid
        const pieceAtPos = board[adjustedMove.from.row][adjustedMove.from.col];
        if (pieceAtPos && pieceAtPos.color === color) {
          const validMoves = getValidMoves(board, adjustedMove.from.row, adjustedMove.from.col);
          const isValidBookMove = validMoves.some(
            move => move.row === adjustedMove.to.row && move.col === adjustedMove.to.col
          );
          
          if (isValidBookMove) {
            return adjustedMove;
          }
        }
      }
    }
    
    // If no book move, use search algorithm
    let bestMove: { from: Position; to: Position } | null = null;
    
    // Set depth based on difficulty
    let maxDepth = 2; // Easy
    if (aiConfig.difficulty === 'medium') maxDepth = 3;
    if (aiConfig.difficulty === 'hard') maxDepth = 4;
    
    // Iterative deepening - start with shallow search to guarantee some result
    let bestMovePerDepth: { from: Position; to: Position } | null = null;
    
    // Start with depth 1 and go deeper if time allows
    for (let currentDepth = 1; currentDepth <= maxDepth; currentDepth++) {
      let bestValue = color === 'white' ? -Infinity : Infinity;
      
      // Order moves - check captures and checks first for better pruning
      let allMoves: { piece: Position; move: Position; priority: number }[] = [];
      
      // Collect and score all possible moves
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board[row][col];
          if (piece && piece.color === color) {
            const validMoves = getValidMoves(board, row, col);
            
            validMoves.forEach(move => {
              let priority = 0;
              
              // Prioritize captures by captured piece value
              if (board[move.row][move.col]) {
                const capturedPiece = board[move.row][move.col]!;
                priority += PIECE_VALUES[capturedPiece.type];
              }
              
              // Prioritize center squares for early moves
              if ((move.row === 3 || move.row === 4) && (move.col === 3 || move.col === 4)) {
                priority += 50;
              }
              
              allMoves.push({
                piece: { row, col },
                move,
                priority
              });
            });
          }
        }
      }
      
      // Sort moves by priority (highest first)
      allMoves.sort((a, b) => b.priority - a.priority);
      
      // Evaluate all moves with current depth
      for (const { piece, move } of allMoves) {
        // Make move
        const newBoard = JSON.parse(JSON.stringify(board));
        const capturedPiece = newBoard[move.row][move.col];
        newBoard[move.row][move.col] = newBoard[piece.row][piece.col];
        newBoard[piece.row][piece.col] = null;
        
        // Evaluate move
        const value = minimax(
          newBoard,
          currentDepth - 1,
          -Infinity,
          Infinity,
          color === 'black', // If black just moved, next player is white (maximizing)
          color === 'white' ? 'black' : 'white'
        );
        
        // Update best move
        if ((color === 'white' && value > bestValue) || 
            (color === 'black' && value < bestValue)) {
          bestValue = value;
          bestMovePerDepth = { 
            from: { row: piece.row, col: piece.col }, 
            to: { row: move.row, col: move.col }
          };
        }
      }
      
      // Save the best move for this depth
      if (bestMovePerDepth) {
        bestMove = bestMovePerDepth;
      }
    }
    
    return bestMove;
  };

  // Make an AI move
  const makeAIMove = () => {
    console.log('makeAIMove called', {
      aiEnabled: aiConfig.enabled,
      thinking: aiConfig.thinking,
      currentPlayer: gameState.currentPlayer,
      checkmate: gameState.checkmate
    });
    
    if (!aiConfig.enabled || aiConfig.thinking || gameState.checkmate) {
      console.log('AI move skipped - conditions not met');
      return;
    }
    
    // Ensure it's black's turn (AI plays as black)
    if (gameState.currentPlayer !== 'black') {
      console.log('AI move skipped - not black\'s turn');
      return;
    }
    
    setAIConfig(prev => ({ ...prev, thinking: true }));
    console.log('AI thinking state set to true');
    
    // Add a slight delay to simulate "thinking"
    aiTimeoutRef.current = setTimeout(() => {
      console.log('AI timeout executed');
      const bestMove = findBestMove(gameState.board, 'black');
      console.log('AI best move found:', bestMove);
      
      if (bestMove) {
        // Execute the move directly instead of using handleSquareClick
        const newGameState = JSON.parse(JSON.stringify(gameState)) as GameState;
        const { board } = newGameState;
        
        // Store the move in history
        const piece = board[bestMove.from.row][bestMove.from.col]!;
        const captured = board[bestMove.to.row][bestMove.to.col];
        
        newGameState.gameHistory.push({
          from: { ...bestMove.from },
          to: { ...bestMove.to },
          piece: { ...piece },
          captured: captured ? { ...captured } : undefined
        });

        // If capturing a piece, add it to captured pieces
        if (captured) {
          newGameState.capturedPieces[captured.color].push({ ...captured });
        }

        // Move the piece
        board[bestMove.to.row][bestMove.to.col] = board[bestMove.from.row][bestMove.from.col];
        board[bestMove.from.row][bestMove.from.col] = null;
        
        // Mark that the piece has moved (for special moves like castling)
        if (board[bestMove.to.row][bestMove.to.col]) {
          board[bestMove.to.row][bestMove.to.col]!.hasMoved = true;
        }

        // Check for pawn promotion
        if (board[bestMove.to.row][bestMove.to.col]?.type === 'pawn') {
          if (board[bestMove.to.row][bestMove.to.col]?.color === 'black' && bestMove.to.row === 7) {
            // Auto-promote to queen for simplicity
            board[bestMove.to.row][bestMove.to.col]!.type = 'queen';
          }
        }

        // Switch player
        newGameState.currentPlayer = 'white';
        newGameState.selectedPiece = null;
        newGameState.validMoves = [];

        // Check for check or checkmate
        const checkStatus = isKingInCheck(board, 'white');
        newGameState.check = checkStatus ? 'white' : null;
        
        if (checkStatus) {
          const hasValidMoves = hasAnyValidMoves(board, 'white');
          if (!hasValidMoves) {
            newGameState.checkmate = 'white';
          }
        }

        setGameState(newGameState);
        console.log('AI move completed');
      } else {
        console.log('No valid AI move found');
      }
      
      setAIConfig(prev => ({ ...prev, thinking: false }));
      console.log('AI thinking state set to false');
    }, 800); // Slightly longer delay for better visibility
  };

  // Trigger AI move when it's AI's turn
  useEffect(() => {
    console.log('AI effect triggered:', {
      aiEnabled: aiConfig.enabled,
      currentPlayer: gameState.currentPlayer,
      isCheckmate: !!gameState.checkmate,
      isAIThinking: aiConfig.thinking
    });
    
    // Only make AI move when:
    // 1. AI is enabled
    // 2. It's black's turn (AI plays as black)
    // 3. Game is not in checkmate
    // 4. AI is not currently thinking
    if (aiConfig.enabled && 
        gameState.currentPlayer === 'black' && 
        !gameState.checkmate && 
        !aiConfig.thinking) {
      console.log('Scheduling AI move from effect hook');
      // Use a small delay to prevent immediate execution
      const timer = setTimeout(() => {
        makeAIMove();
      }, 100);
      
      return () => clearTimeout(timer);
    }
    
    // Clean up timeout on unmount
    return () => {
      if (aiTimeoutRef.current) {
        console.log('Clearing AI timeout on effect cleanup');
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, [gameState.currentPlayer, aiConfig.enabled, aiConfig.thinking, gameState.checkmate, makeAIMove]);

  return (
    <div className="chess-game-container">
      <h1>Chess Game</h1>
      
      <div className="chess-game">
        <div className="game-board-container">
          {renderBoard()}
          <div className="board-status">
            <div className="status-container">
              <div className="status">
                {gameState.checkmate ? (
                  <div className="game-result">
                    <span className="checkmate-text">Checkmate!</span> 
                    <span className="winner">{gameState.checkmate === 'white' ? 'Black' : 'White'} wins</span>
                  </div>
                ) : (
                  <>
                    <div className="current-turn">
                      <div className={`turn-indicator ${gameState.currentPlayer}`}></div>
                      <span>{gameState.currentPlayer === 'white' ? 'White' : 'Black'} to move</span>
                    </div>
                    {gameState.check && (
                      <div className="check-alert">
                        {gameState.check === 'white' ? 'White' : 'Black'} is in check!
                      </div>
                    )}
                  </>
                )}
                {aiConfig.thinking && <div className="ai-thinking">AI is thinking...</div>}
              </div>
              
              {/* Evaluation bar */}
              <div className="evaluation-bar-container">
                <div 
                  className="evaluation-bar"
                  style={{ 
                    transform: `translateY(${Math.min(Math.max(-evaluation / 20, -100), 100) * 0.5}%)`,
                    backgroundColor: evaluation > 0 ? '#fff' : '#000',
                    color: evaluation > 0 ? '#000' : '#fff'
                  }}
                >
                  {Math.abs(evaluation) > 2 && (evaluation / 100).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="game-sidebar">
          <div className="control-panels">
            {/* Game control panel */}
            <div className="control-panel">
              <h3 className="panel-title">Game Controls</h3>
              <div className="game-controls">
                <button onClick={restartGame}>New Game</button>
                <button onClick={flipBoard}>Flip Board</button>
              </div>
              <div className="game-controls secondary">
                <button onClick={() => setShowValidMoves(!showValidMoves)}>
                  {showValidMoves ? 'Hide Moves' : 'Show Moves'}
                </button>
                <button onClick={() => setShowCoordinates(!showCoordinates)}>
                  {showCoordinates ? 'Hide Coords' : 'Show Coords'}
                </button>
              </div>
            </div>
            
            {/* AI control panel */}
            <div className="control-panel">
              <h3 className="panel-title">AI Opponent</h3>
              <div className="ai-toggle">
                <button 
                  onClick={toggleAI}
                  className={aiConfig.enabled ? 'active' : ''}
                >
                  {aiConfig.enabled ? 'AI: ON' : 'AI: OFF'}
                </button>
              </div>
              
              {aiConfig.enabled && (
                <div className="ai-difficulty">
                  <p>Difficulty:</p>
                  <div className="difficulty-options">
                    <button 
                      onClick={() => changeDifficulty('easy')}
                      className={aiConfig.difficulty === 'easy' ? 'active' : ''}
                    >
                      Easy
                    </button>
                    <button 
                      onClick={() => changeDifficulty('medium')}
                      className={aiConfig.difficulty === 'medium' ? 'active' : ''}
                    >
                      Medium
                    </button>
                    <button 
                      onClick={() => changeDifficulty('hard')}
                      className={aiConfig.difficulty === 'hard' ? 'active' : ''}
                    >
                      Hard
                    </button>
                  </div>
                </div>
              )}
              
              {aiConfig.enabled && (
                <div className="ai-status-info">
                  Playing as White against AI (Black)
                </div>
              )}
            </div>
          </div>
          
          {renderCapturedPieces()}
          
          <div className="move-history-panel">
            <h3 className="panel-title">Move History</h3>
            <div className="move-history">
              <div className="move-list">
                {gameState.gameHistory.length === 0 ? (
                  <p className="no-moves">No moves yet</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>White</th>
                        <th>Black</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: Math.ceil(gameState.gameHistory.length / 2) }).map((_, idx) => {
                        const whiteMove = gameState.gameHistory[idx * 2];
                        const blackMove = gameState.gameHistory[idx * 2 + 1];
                        
                        return (
                          <tr key={idx}>
                            <td>{idx + 1}.</td>
                            <td>
                              {whiteMove && moveToNotation(
                                whiteMove.from, 
                                whiteMove.to, 
                                whiteMove.piece, 
                                whiteMove.captured,
                                // Check if this move put the opponent in check
                                idx * 2 + 1 < gameState.gameHistory.length && gameState.check === 'black',
                                idx * 2 + 1 < gameState.gameHistory.length && gameState.checkmate === 'black'
                              )}
                            </td>
                            <td>
                              {blackMove && moveToNotation(
                                blackMove.from,
                                blackMove.to,
                                blackMove.piece,
                                blackMove.captured,
                                // Check if this move put the opponent in check
                                idx * 2 + 2 < gameState.gameHistory.length && gameState.check === 'white',
                                idx * 2 + 2 < gameState.gameHistory.length && gameState.checkmate === 'white'
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame; 