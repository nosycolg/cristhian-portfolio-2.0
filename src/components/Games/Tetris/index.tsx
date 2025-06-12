"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RotateCw, Pause, Play, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Gamepad2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DiscordMessage } from "@/components/Discord/Components/DiscordMessage";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const TETROMINOS = {
	I: { shape: [[1, 1, 1, 1]], color: "#00d4aa" },
	O: {
		shape: [
			[1, 1],
			[1, 1],
		],
		color: "#faa61a",
	},
	T: {
		shape: [
			[0, 1, 0],
			[1, 1, 1],
		],
		color: "#5865f2",
	},
	S: {
		shape: [
			[0, 1, 1],
			[1, 1, 0],
		],
		color: "#43b581",
	},
	Z: {
		shape: [
			[1, 1, 0],
			[0, 1, 1],
		],
		color: "#f04747",
	},
	J: {
		shape: [
			[1, 0, 0],
			[1, 1, 1],
		],
		color: "#7289da",
	},
	L: {
		shape: [
			[0, 0, 1],
			[1, 1, 1],
		],
		color: "#ff7675",
	},
};

type TetrominoType = keyof typeof TETROMINOS;

export default function TetrisGame() {
	const [board, setBoard] = useState<number[][]>(() =>
		Array(BOARD_HEIGHT)
			.fill(null)
			.map(() => Array(BOARD_WIDTH).fill(0)),
	);
	const [currentPiece, setCurrentPiece] = useState<{
		type: TetrominoType;
		shape: number[][];
		x: number;
		y: number;
		color: string;
	} | null>(null);
	const [score, setScore] = useState(0);
	const [level, setLevel] = useState(1);
	const [lines, setLines] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [nextPiece, setNextPiece] = useState<TetrominoType | null>(null);

	const gameLoopRef = useRef<NodeJS.Timeout>(null);
	const moveIntervalRef = useRef<NodeJS.Timeout>(null);
	const dropSpeed = Math.max(50, 500 - (level - 1) * 50);

	const createRandomPiece = useCallback((): TetrominoType => {
		const pieces = Object.keys(TETROMINOS) as TetrominoType[];
		return pieces[Math.floor(Math.random() * pieces.length)];
	}, []);

	const createPiece = useCallback((type: TetrominoType) => {
		const tetromino = TETROMINOS[type];
		return {
			type,
			shape: tetromino.shape,
			x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
			y: 0,
			color: tetromino.color,
		};
	}, []);

	const rotatePiece = (shape: number[][]): number[][] => {
		const rotated = shape[0].map((_, index) => shape.map((row) => row[index]).reverse());
		return rotated;
	};

	const isValidMove = useCallback(
		(piece: typeof currentPiece, newX: number, newY: number, newShape?: number[][]) => {
			if (!piece) return false;

			const shape = newShape || piece.shape;

			for (let y = 0; y < shape.length; y++) {
				for (let x = 0; x < shape[y].length; x++) {
					if (shape[y][x]) {
						const boardX = newX + x;
						const boardY = newY + y;

						if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
							return false;
						}

						if (boardY >= 0 && board[boardY][boardX]) {
							return false;
						}
					}
				}
			}
			return true;
		},
		[board],
	);

	const placePiece = useCallback(() => {
		if (!currentPiece) return;

		const newBoard = board.map((row) => [...row]);

		currentPiece.shape.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell) {
					const boardY = currentPiece.y + y;
					const boardX = currentPiece.x + x;
					if (boardY >= 0) {
						newBoard[boardY][boardX] = 1;
					}
				}
			});
		});

		let linesCleared = 0;
		for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
			if (newBoard[y].every((cell) => cell === 1)) {
				newBoard.splice(y, 1);
				newBoard.unshift(Array(BOARD_WIDTH).fill(0));
				linesCleared++;
				y++;
			}
		}

		if (linesCleared > 0) {
			setLines((prev) => prev + linesCleared);
			setScore((prev) => prev + linesCleared * 100 * level);
			setLevel(() => Math.floor((lines + linesCleared) / 10) + 1);
		}

		setBoard(newBoard);

		const nextType = nextPiece || createRandomPiece();
		const newPiece = createPiece(nextType);

		if (!isValidMove(newPiece, newPiece.x, newPiece.y)) {
			setGameOver(true);
			setIsPlaying(false);
			return;
		}

		setCurrentPiece(newPiece);
		setNextPiece(createRandomPiece());
	}, [currentPiece, board, nextPiece, level, lines, createRandomPiece, createPiece, isValidMove]);

	const movePiece = useCallback(
		(dx: number, dy: number) => {
			if (!currentPiece || !isPlaying || isPaused) return;

			const newX = currentPiece.x + dx;
			const newY = currentPiece.y + dy;

			if (isValidMove(currentPiece, newX, newY)) {
				setCurrentPiece((prev) => (prev ? { ...prev, x: newX, y: newY } : null));
			} else if (dy > 0) {
				placePiece();
			}
		},
		[currentPiece, isPlaying, isPaused, isValidMove, placePiece],
	);

	const rotatePieceHandler = useCallback(() => {
		if (!currentPiece || !isPlaying || isPaused) return;

		const rotatedShape = rotatePiece(currentPiece.shape);
		if (isValidMove(currentPiece, currentPiece.x, currentPiece.y, rotatedShape)) {
			setCurrentPiece((prev) => (prev ? { ...prev, shape: rotatedShape } : null));
		}
	}, [currentPiece, isPlaying, isPaused, isValidMove]);

	const dropPiece = useCallback(() => {
		movePiece(0, 1);
	}, [movePiece]);

	const hardDrop = useCallback(() => {
		if (!currentPiece || !isPlaying || isPaused) return;

		let newY = currentPiece.y;
		while (isValidMove(currentPiece, currentPiece.x, newY + 1)) {
			newY++;
		}
		setCurrentPiece((prev) => (prev ? { ...prev, y: newY } : null));
		setTimeout(placePiece, 50);
	}, [currentPiece, isPlaying, isPaused, isValidMove, placePiece]);

	const startGame = () => {
		setBoard(
			Array(BOARD_HEIGHT)
				.fill(null)
				.map(() => Array(BOARD_WIDTH).fill(0)),
		);
		setScore(0);
		setLevel(1);
		setLines(0);
		setGameOver(false);
		setIsPaused(false);

		const firstPiece = createRandomPiece();
		setCurrentPiece(createPiece(firstPiece));
		setNextPiece(createRandomPiece());
		setIsPlaying(true);
	};

	const pauseGame = () => {
		setIsPaused(!isPaused);
	};

	useEffect(() => {
		if (isPlaying && !isPaused && !gameOver) {
			gameLoopRef.current = setInterval(dropPiece, dropSpeed);
		} else {
			if (gameLoopRef.current) {
				clearInterval(gameLoopRef.current);
			}
		}

		return () => {
			if (gameLoopRef.current) {
				clearInterval(gameLoopRef.current);
			}
		};
	}, [isPlaying, isPaused, gameOver, dropSpeed, dropPiece]);

	useEffect(() => {
		const pressedKeys = new Set<string>();

		const startContinuousMove = (direction: number) => {
			if (moveIntervalRef.current) {
				clearInterval(moveIntervalRef.current);
			}

			movePiece(direction, 0);

			setTimeout(() => {
				moveIntervalRef.current = setInterval(() => {
					movePiece(direction, 0);
				}, 80);
			}, 150);
		};

		const stopContinuousMove = () => {
			if (moveIntervalRef.current) {
				clearInterval(moveIntervalRef.current);
				moveIntervalRef.current = null;
			}
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isPlaying || isPaused) return;

			const key = e.key;
			if (pressedKeys.has(key)) return;
			pressedKeys.add(key);

			switch (key) {
				case "ArrowLeft":
					e.preventDefault();
					startContinuousMove(-1);
					break;
				case "ArrowRight":
					e.preventDefault();
					startContinuousMove(1);
					break;
				case "ArrowDown":
					e.preventDefault();
					movePiece(0, 1);
					break;
				case "ArrowUp":
				case " ":
					e.preventDefault();
					rotatePieceHandler();
					break;
				case "Enter":
					e.preventDefault();
					hardDrop();
					break;
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			pressedKeys.delete(e.key);
			if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
				stopContinuousMove();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			stopContinuousMove();
		};
	}, [isPlaying, isPaused, movePiece, rotatePieceHandler, hardDrop]);

	const renderBoard = () => {
		const displayBoard = board.map((row) => [...row]);

		if (currentPiece) {
			currentPiece.shape.forEach((row, y) => {
				row.forEach((cell, x) => {
					if (cell) {
						const boardY = currentPiece.y + y;
						const boardX = currentPiece.x + x;
						if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
							displayBoard[boardY][boardX] = 2;
						}
					}
				});
			});
		}

		return displayBoard.map((row, y) => (
			<div key={y} className="m-auto flex">
				{row.map((cell, x) => (
					<div
						key={x}
						className={`h-8 w-8 border border-[#40444b] transition-colors duration-100 ${
							cell === 1 ? "bg-[#43b581] shadow-lg" : cell === 2 ? "bg-[#faa61a] shadow-lg" : "bg-[#2f3136]"
						}`}
					/>
				))}
			</div>
		));
	};

	const startContinuousMove = (direction: number) => {
		if (moveIntervalRef.current) {
			clearInterval(moveIntervalRef.current);
		}

		movePiece(direction, 0);

		setTimeout(() => {
			moveIntervalRef.current = setInterval(() => {
				movePiece(direction, 0);
			}, 80);
		}, 150);
	};

	const stopContinuousMove = () => {
		if (moveIntervalRef.current) {
			clearInterval(moveIntervalRef.current);
			moveIntervalRef.current = null;
		}
	};

	return (
		<div className="w-full">
			<DiscordMessage
				icon={<Gamepad2 className="h-5 w-5 text-white" />}
				title="Tetris"
				badgeText="Retro"
				badgeColor="#43b581"
			>
				<div className="grid min-h-[600px] w-full grid-cols-1 gap-6 p-4 lg:grid-cols-3">
					<div className="mr-auto flex w-full flex-col lg:col-span-2">
						<div className="rounded-lg border border-[#40444b] bg-[#2f3136] p-6 shadow-xl">
							<div className="m-auto flex w-full flex-col rounded-lg border-2 border-[#5865f2] bg-[#202225] p-3">
								{renderBoard()}
							</div>
						</div>

						<div className="mt-6 lg:hidden">
							<div className="mb-4 grid grid-cols-3 gap-3">
								<div></div>
								<Button
									variant="outline"
									size="lg"
									onClick={rotatePieceHandler}
									disabled={!isPlaying || isPaused}
									className="h-12 w-12 border-[#5865f2] bg-[#40444b] text-white hover:bg-[#5865f2]"
								>
									<RotateCw className="h-5 w-5" />
								</Button>
								<div></div>
								<Button
									variant="outline"
									size="lg"
									onTouchStart={() => startContinuousMove(-1)}
									onTouchEnd={stopContinuousMove}
									disabled={!isPlaying || isPaused}
									className="h-12 w-12 border-[#5865f2] bg-[#40444b] text-white hover:bg-[#5865f2]"
								>
									<ArrowLeft className="h-5 w-5" />
								</Button>
								<Button
									variant="outline"
									size="lg"
									onClick={() => movePiece(0, 1)}
									disabled={!isPlaying || isPaused}
									className="h-12 w-12 border-[#5865f2] bg-[#40444b] text-white hover:bg-[#5865f2]"
								>
									<ArrowDown className="h-5 w-5" />
								</Button>
								<Button
									variant="outline"
									size="lg"
									onTouchStart={() => startContinuousMove(1)}
									onTouchEnd={stopContinuousMove}
									disabled={!isPlaying || isPaused}
									className="h-12 w-12 border-[#5865f2] bg-[#40444b] text-white hover:bg-[#5865f2]"
								>
									<ArrowRight className="h-5 w-5" />
								</Button>
							</div>
							<Button
								variant="outline"
								size="lg"
								onClick={hardDrop}
								disabled={!isPlaying || isPaused}
								className="h-12 w-full border-[#f04747] bg-[#40444b] text-white hover:bg-[#f04747]"
							>
								<ArrowDown className="mr-2 h-5 w-5" />
								Queda Rápida
							</Button>
						</div>
					</div>
					<div className="w-full space-y-4 lg:row-span-4 xl:row-span-5">
						<div className="flex flex-col rounded-lg border border-[#40444b] bg-[#2f3136] p-6">
							<h3 className="mb-4 flex items-center text-lg font-bold text-[#ffffff]">
								<Gamepad2 className="mr-2 h-5 w-5 text-[#5865f2]" />
								Estatísticas
							</h3>
							<div className="flex-1 space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-[#8e9297]">Pontuação:</span>
									<span className="text-xl font-bold text-[#43b581]">{score.toLocaleString()}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-[#8e9297]">Linhas:</span>
									<span className="text-xl font-bold text-[#faa61a]">{lines}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-[#8e9297]">Nível:</span>
									<span className="text-xl font-bold text-[#5865f2]">{level}</span>
								</div>
							</div>

							{nextPiece && (
								<div className="mt-6">
									<h4 className="mb-3 font-medium text-[#ffffff]">Próxima Peça</h4>
									<div className="flex justify-center">
										<div
											className="grid gap-1 rounded border border-[#40444b] bg-[#202225] p-4"
											style={{ gridTemplateColumns: `repeat(4, 1fr)` }}
										>
											{Array(4)
												.fill(null)
												.map((_, y) =>
													Array(4)
														.fill(null)
														.map((_, x) => {
															const shape = TETROMINOS[nextPiece].shape;
															const isActive = shape[y] && shape[y][x];
															return (
																<div
																	key={`${y}-${x}`}
																	className={`h-6 w-6 border border-[#40444b] ${
																		isActive ? "bg-[#faa61a]" : "bg-[#2f3136]"
																	}`}
																/>
															);
														}),
												)}
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="flex flex-col rounded-lg border border-[#40444b] bg-[#2f3136] p-6">
							<h3 className="mb-4 text-lg font-bold text-[#ffffff]">Controles</h3>
							<div className="flex-1 space-y-3">
								{!isPlaying ? (
									<Button onClick={startGame} className="w-full bg-[#43b581] py-3 text-white hover:bg-[#3ca374]">
										<Play className="mr-2 h-5 w-5" />
										{gameOver ? "Jogar Novamente" : "Iniciar Jogo"}
									</Button>
								) : (
									<Button onClick={pauseGame} className="w-full bg-[#faa61a] py-3 text-white hover:bg-[#f0ad4e]">
										{isPaused ? <Play className="mr-2 h-5 w-5" /> : <Pause className="mr-2 h-5 w-5" />}
										{isPaused ? "Continuar" : "Pausar"}
									</Button>
								)}
							</div>

							<div className="mt-6 space-y-2 text-sm text-[#8e9297]">
								<div className="flex items-center space-x-2">
									<ArrowLeft className="h-4 w-4" />
									<ArrowRight className="h-4 w-4" />
									<span>Mover peça (segure para contínuo)</span>
								</div>
								<div className="flex items-center space-x-2">
									<ArrowUp className="h-4 w-4" />
									<span>Girar peça</span>
								</div>
								<div className="flex items-center space-x-2">
									<ArrowDown className="h-4 w-4" />
									<span>Descer mais rápido</span>
								</div>
								<div className="flex items-center space-x-2">
									<span className="rounded bg-[#40444b] px-2 py-1 text-xs">Enter</span>
									<span>Queda instantânea</span>
								</div>
							</div>

							{gameOver && (
								<div className="mt-6 rounded-lg border border-[#f04747] bg-[#f04747] bg-opacity-20 p-4">
									<h4 className="mb-2 text-center text-xl font-bold text-[#f04747]">Game Over!</h4>
									<p className="text-center text-[#dcddde]">
										Pontuação final: <span className="font-bold">{score.toLocaleString()}</span>
									</p>
									<p className="text-center text-[#dcddde]">
										Linhas completadas: <span className="font-bold">{lines}</span>
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</DiscordMessage>
		</div>
	);
}
