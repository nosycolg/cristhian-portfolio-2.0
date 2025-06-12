"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gamepad2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DiscordMessage } from "@/components/Discord/Components/DiscordMessage";

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_FOOD = { x: 15, y: 15 };

type Position = { x: number; y: number };
type Direction = { x: number; y: number };

export default function SnakeGame() {
	const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
	const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
	const [food, setFood] = useState<Position>(INITIAL_FOOD);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(() => {
		if (typeof window !== "undefined") {
			return Number.parseInt(localStorage.getItem("snake-high-score") || "0");
		}
		return 0;
	});

	const gameLoopRef = useRef<NodeJS.Timeout>(null);
	const directionRef = useRef(direction);
	const lastDirectionChange = useRef<number>(0);

	const generateFood = useCallback((currentSnake: Position[]): Position => {
		let newFood: Position;
		do {
			newFood = {
				x: Math.floor(Math.random() * BOARD_SIZE),
				y: Math.floor(Math.random() * BOARD_SIZE),
			};
		} while (currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
		return newFood;
	}, []);

	const moveSnake = useCallback(() => {
		if (!isPlaying || isPaused || gameOver) return;

		setSnake((currentSnake) => {
			const newSnake = [...currentSnake];
			const head = { ...newSnake[0] };

			head.x += directionRef.current.x;
			head.y += directionRef.current.y;

			if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
				setGameOver(true);
				setIsPlaying(false);
				return currentSnake;
			}

			if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
				setGameOver(true);
				setIsPlaying(false);
				return currentSnake;
			}

			newSnake.unshift(head);

			if (head.x === food.x && head.y === food.y) {
				setScore((prev) => {
					const newScore = prev + 10;
					if (newScore > highScore) {
						setHighScore(newScore);
						localStorage.setItem("snake-high-score", newScore.toString());
					}
					return newScore;
				});
				setFood(generateFood(newSnake));
			} else {
				newSnake.pop();
			}

			return newSnake;
		});
	}, [isPlaying, isPaused, gameOver, food, generateFood, highScore]);

	const changeDirection = useCallback(
		(newDirection: Direction) => {
			if (!isPlaying || isPaused) return;

			const now = Date.now();
			if (now - lastDirectionChange.current < 100) return;
			lastDirectionChange.current = now;

			if (
				(newDirection.x === -directionRef.current.x && newDirection.y === -directionRef.current.y) ||
				(newDirection.x === 0 && newDirection.y === 0)
			) {
				return;
			}

			directionRef.current = newDirection;
			setDirection(newDirection);
		},
		[isPlaying, isPaused],
	);

	const startGame = () => {
		setSnake(INITIAL_SNAKE);
		setDirection(INITIAL_DIRECTION);
		directionRef.current = INITIAL_DIRECTION;
		setFood(generateFood(INITIAL_SNAKE));
		setScore(0);
		setGameOver(false);
		setIsPaused(false);
		setIsPlaying(true);
	};

	const pauseGame = () => {
		setIsPaused(!isPaused);
	};

	const resetGame = () => {
		setIsPlaying(false);
		setIsPaused(false);
		setGameOver(false);
		setSnake(INITIAL_SNAKE);
		setDirection(INITIAL_DIRECTION);
		directionRef.current = INITIAL_DIRECTION;
		setFood(INITIAL_FOOD);
		setScore(0);
	};

	useEffect(() => {
		if (isPlaying && !isPaused && !gameOver) {
			const speed = Math.max(100, 200 - Math.floor(score / 50) * 10);
			gameLoopRef.current = setInterval(moveSnake, speed);
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
	}, [isPlaying, isPaused, gameOver, moveSnake, score]);

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (!isPlaying) return;

			switch (e.key) {
				case "ArrowUp":
				case "w":
				case "W":
					e.preventDefault();
					changeDirection({ x: 0, y: -1 });
					break;
				case "ArrowDown":
				case "s":
				case "S":
					e.preventDefault();
					changeDirection({ x: 0, y: 1 });
					break;
				case "ArrowLeft":
				case "a":
				case "A":
					e.preventDefault();
					changeDirection({ x: -1, y: 0 });
					break;
				case "ArrowRight":
				case "d":
				case "D":
					e.preventDefault();
					changeDirection({ x: 1, y: 0 });
					break;
				case " ":
					e.preventDefault();
					pauseGame();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [isPlaying, changeDirection]);

	const renderBoard = () => {
		const board = [];
		for (let y = 0; y < BOARD_SIZE; y++) {
			for (let x = 0; x < BOARD_SIZE; x++) {
				const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
				const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
				const isFood = food.x === x && food.y === y;

				board.push(
					<div
						key={`${x}-${y}`}
						className={`aspect-square w-full scale-110 border border-[#40444b] transition-all duration-150 ${
							isHead
								? "scale-110 rounded-sm bg-[#43b581] shadow-lg"
								: isSnake
									? "rounded-sm bg-[#5865f2] shadow-md"
									: isFood
										? "z-10 scale-110 animate-pulse rounded-sm bg-[#f04747] shadow-xl"
										: "bg-[#2f3136] hover:bg-[#36393f]"
						} `}
					/>,
				);
			}
		}
		return board;
	};

	return (
		<div className="w-full">
			<DiscordMessage
				icon={<Gamepad2 className="h-5 w-5 text-white" />}
				title="Snake"
				badgeText="Retro"
				badgeColor="#43b581"
				subtitle="Jogo clássico da cobrinha - Totalmente responsivo"
			>
				<div className="flex flex-col space-y-4 p-4 lg:grid lg:grid-cols-12 lg:gap-6 lg:space-y-0">
					<div className="lg:col-span-8 xl:col-span-7">
						<div className="flex flex-col items-center space-y-4">
							<div className="mr-auto w-full max-w-3xl">
								<div className="aspect-square w-full rounded-lg border-2 border-[#43b581] bg-[#202225] p-2 shadow-2xl sm:p-3">
									<div
										className="grid h-full w-full gap-0 overflow-hidden rounded-md"
										style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
									>
										{renderBoard()}
									</div>
								</div>
							</div>

							<div className="mx-auto w-full max-w-xs lg:hidden">
								<div className="grid grid-cols-3 gap-2 rounded-lg border border-[#40444b] bg-[#2f3136] p-4">
									<div></div>
									<Button
										variant="outline"
										size="lg"
										onClick={() => changeDirection({ x: 0, y: -1 })}
										disabled={!isPlaying || isPaused}
										className="aspect-square border-[#43b581] bg-[#40444b] text-white transition-all hover:bg-[#43b581] active:scale-95 disabled:opacity-50"
									>
										<ArrowUp className="h-5 w-5" />
									</Button>
									<div></div>

									<Button
										variant="outline"
										size="lg"
										onClick={() => changeDirection({ x: -1, y: 0 })}
										disabled={!isPlaying || isPaused}
										className="aspect-square border-[#43b581] bg-[#40444b] text-white transition-all hover:bg-[#43b581] active:scale-95 disabled:opacity-50"
									>
										<ArrowLeft className="h-5 w-5" />
									</Button>
									<Button
										variant="outline"
										size="lg"
										onClick={pauseGame}
										disabled={!isPlaying}
										className="aspect-square border-[#faa61a] bg-[#40444b] text-white transition-all hover:bg-[#faa61a] active:scale-95 disabled:opacity-50"
									>
										{isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
									</Button>
									<Button
										variant="outline"
										size="lg"
										onClick={() => changeDirection({ x: 1, y: 0 })}
										disabled={!isPlaying || isPaused}
										className="aspect-square border-[#43b581] bg-[#40444b] text-white transition-all hover:bg-[#43b581] active:scale-95 disabled:opacity-50"
									>
										<ArrowRight className="h-5 w-5" />
									</Button>

									<div></div>
									<Button
										variant="outline"
										size="lg"
										onClick={() => changeDirection({ x: 0, y: 1 })}
										disabled={!isPlaying || isPaused}
										className="aspect-square border-[#43b581] bg-[#40444b] text-white transition-all hover:bg-[#43b581] active:scale-95 disabled:opacity-50"
									>
										<ArrowDown className="h-5 w-5" />
									</Button>
									<div></div>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-4 lg:col-span-4 xl:col-span-5">
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
							<div className="rounded-lg border border-[#40444b] bg-[#2f3136] p-3 text-center">
								<div className="text-lg font-bold text-[#43b581] sm:text-xl">{score}</div>
								<div className="text-xs text-[#8e9297]">Pontos</div>
							</div>
							<div className="rounded-lg border border-[#40444b] bg-[#2f3136] p-3 text-center">
								<div className="text-lg font-bold text-[#faa61a] sm:text-xl">{highScore}</div>
								<div className="text-xs text-[#8e9297]">Recorde</div>
							</div>
							<div className="rounded-lg border border-[#40444b] bg-[#2f3136] p-3 text-center">
								<div className="text-lg font-bold text-[#5865f2] sm:text-xl">{snake.length}</div>
								<div className="text-xs text-[#8e9297]">Tamanho</div>
							</div>
							<div className="rounded-lg border border-[#40444b] bg-[#2f3136] p-3 text-center">
								<div className="text-lg font-bold text-[#f04747] sm:text-xl">{Math.floor(score / 50) + 1}</div>
								<div className="text-xs text-[#8e9297]">Nível</div>
							</div>
						</div>

						<div className="space-y-3 rounded-lg border border-[#40444b] bg-[#2f3136] p-4">
							<h3 className="flex items-center text-lg font-bold text-[#ffffff]">
								<Gamepad2 className="mr-2 h-5 w-5 text-[#43b581]" />
								Controles
							</h3>

							<div className="space-y-2">
								{!isPlaying ? (
									<Button
										onClick={startGame}
										className="w-full bg-[#43b581] py-3 text-base font-medium text-white transition-all hover:bg-[#3ca374] active:scale-95"
									>
										<Play className="mr-2 h-5 w-5" />
										{gameOver ? "Jogar Novamente" : "Iniciar Jogo"}
									</Button>
								) : (
									<Button
										onClick={pauseGame}
										className="w-full bg-[#faa61a] py-3 text-base font-medium text-white transition-all hover:bg-[#f0ad4e] active:scale-95"
									>
										{isPaused ? <Play className="mr-2 h-5 w-5" /> : <Pause className="mr-2 h-5 w-5" />}
										{isPaused ? "Continuar" : "Pausar"}
									</Button>
								)}

								<Button
									onClick={resetGame}
									variant="outline"
									className="w-full border-[#f04747] py-3 text-base font-medium text-[#f04747] transition-all hover:bg-[#f04747] hover:text-white active:scale-95"
								>
									<RotateCcw className="mr-2 h-5 w-5" />
									Reiniciar
								</Button>
							</div>
						</div>

						<div className="rounded-lg border border-[#40444b] bg-[#2f3136] p-4">
							<h4 className="mb-3 text-sm font-bold text-[#ffffff]">Como Jogar</h4>
							<div className="space-y-2 text-xs text-[#8e9297]">
								<div className="hidden items-center space-x-2 lg:flex">
									<div className="flex space-x-1">
										<ArrowUp className="h-3 w-3" />
										<ArrowDown className="h-3 w-3" />
										<ArrowLeft className="h-3 w-3" />
										<ArrowRight className="h-3 w-3" />
									</div>
									<span>Setas para mover</span>
								</div>
								<div className="hidden items-center space-x-2 lg:flex">
									<span className="rounded bg-[#40444b] px-2 py-1 text-xs">WASD</span>
									<span>Controles alternativos</span>
								</div>
								<div className="hidden items-center space-x-2 lg:flex">
									<span className="rounded bg-[#40444b] px-2 py-1 text-xs">Space</span>
									<span>Pausar jogo</span>
								</div>
								<div className="text-center lg:hidden">
									<span>Use os botões na tela para jogar</span>
								</div>
							</div>
						</div>

						{gameOver && (
							<div className="rounded-lg border border-[#f04747] bg-[#f04747] bg-opacity-20 p-4 text-center">
								<h4 className="mb-2 text-xl font-bold text-[#f04747]">Game Over!</h4>
								<div className="space-y-1 text-sm text-[#dcddde]">
									<p>
										Pontuação Final: <span className="font-bold text-[#43b581]">{score}</span>
									</p>
									<p>
										Tamanho da Cobra: <span className="font-bold text-[#5865f2]">{snake.length}</span>
									</p>
									{score === highScore && score > 0 && (
										<p className="mt-2 font-bold text-[#faa61a]">🏆 Novo Recorde!</p>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</DiscordMessage>
		</div>
	);
}
