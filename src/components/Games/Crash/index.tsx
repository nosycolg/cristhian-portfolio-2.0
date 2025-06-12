"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, DollarSign, BarChart3, Rocket, Zap, Target, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DiscordMessage } from "@/components/Discord/Components/DiscordMessage";

interface ChartPoint {
	time: number;
	value: number;
}

export default function CrashGame() {
	const [multiplier, setMultiplier] = useState<number>(1.0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [isCrashed, setIsCrashed] = useState<boolean>(false);
	const [bet, setBet] = useState<number>(10);
	const [balance, setBalance] = useState<number>(() => {
		if (typeof window !== "undefined") {
			return Number.parseInt(localStorage.getItem("crash-balance") || "1000");
		}
		return 1000;
	});
	const [cashedOut, setCashedOut] = useState<boolean>(false);
	const [cashOutMultiplier, setCashOutMultiplier] = useState<number>(0);
	const [gameHistory, setGameHistory] = useState<number[]>([]);
	const [isAutoMode, setIsAutoMode] = useState<boolean>(false);
	const [highestMultiplier, setHighestMultiplier] = useState<number>(() => {
		if (typeof window !== "undefined") {
			return Number.parseFloat(localStorage.getItem("crash-highest") || "1.0");
		}
		return 1.0;
	});

	const [countdown, setCountdown] = useState<number>(10);
	const [isCountingDown, setIsCountingDown] = useState<boolean>(true);
	const [hasActiveBet, setHasActiveBet] = useState<boolean>(false);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationFrameRef = useRef<number>(0);
	const crashPointRef = useRef<number>(1.0);
	const startTimeRef = useRef<number>(0);
	const isPlayingRef = useRef<boolean>(false);
	const isCrashedRef = useRef<boolean>(false);
	const cashedOutRef = useRef<boolean>(false);
	const autoCashOutRef = useRef<number>(2.0);
	const isAutoModeRef = useRef<boolean>(false);
	const chartPointsRef = useRef<ChartPoint[]>([]);
	const countdownIntervalRef = useRef<NodeJS.Timeout>(null);

	const generateCrashPoint = (): number => {
		const random = Math.random();
		if (random < 0.5) return 1.0 + Math.random() * 1.5;
		if (random < 0.8) return 2.5 + Math.random() * 2.5;
		if (random < 0.95) return 5.0 + Math.random() * 5.0;
		return 10.0 + Math.random() * 40.0;
	};

	const calculateMultiplier = (elapsed: number): number => {
		if (elapsed < 0.1) return 1.0;
		return 1 + (Math.pow(Math.E, elapsed * 0.2) - 1) / 4;
	};

	const drawChart = (): void => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const width = canvas.width;
		const height = canvas.height;

		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = "#36393f";
		ctx.fillRect(0, 0, width, height);

		ctx.strokeStyle = "#40444b";
		ctx.lineWidth = 1;

		for (let x = 0; x <= width; x += width / 10) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			ctx.stroke();
		}

		for (let y = 0; y <= height; y += height / 8) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
			ctx.stroke();
		}

		if (chartPointsRef.current.length > 1) {
			const points = chartPointsRef.current;
			const maxTime = Math.max(...points.map((p) => p.time), 10);
			const maxValue = Math.max(2, ...points.map((p) => p.value));

			const canvasPoints = points.map((point) => {
				const normalizedValue = Math.max(0, point.value - 1);
				const maxNormalizedValue = Math.max(0.1, maxValue - 1);
				return {
					x: (point.time / maxTime) * width * 0.9 + width * 0.05,
					y: height - 30 - (normalizedValue / maxNormalizedValue) * (height - 60),
				};
			});

			if (canvasPoints.length > 0 && points[0].value <= 1.01) {
				canvasPoints[0].y = height - 30;
			}

			const gradient = ctx.createLinearGradient(0, height, 0, 0);
			if (isCrashedRef.current) {
				gradient.addColorStop(0, "rgba(240, 71, 71, 0.3)");
				gradient.addColorStop(1, "rgba(240, 71, 71, 0.1)");
			} else if (cashedOutRef.current) {
				gradient.addColorStop(0, "rgba(67, 181, 129, 0.3)");
				gradient.addColorStop(1, "rgba(67, 181, 129, 0.1)");
			} else {
				gradient.addColorStop(0, "rgba(88, 101, 242, 0.3)");
				gradient.addColorStop(1, "rgba(88, 101, 242, 0.1)");
			}

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.moveTo(canvasPoints[0].x, height - 30);

			for (let i = 0; i < canvasPoints.length - 1; i++) {
				const current = canvasPoints[i];
				const next = canvasPoints[i + 1];
				const midX = (current.x + next.x) / 2;
				const midY = (current.y + next.y) / 2;

				if (i === 0) {
					ctx.lineTo(current.x, current.y);
				}

				ctx.quadraticCurveTo(current.x, current.y, midX, midY);
			}

			ctx.lineTo(canvasPoints[canvasPoints.length - 1].x, height - 30);
			ctx.closePath();
			ctx.fill();

			ctx.strokeStyle = isCrashedRef.current ? "#f04747" : cashedOutRef.current ? "#43b581" : "#5865f2";
			ctx.lineWidth = 4;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";

			ctx.shadowColor = ctx.strokeStyle;
			ctx.shadowBlur = 8;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;

			ctx.beginPath();
			ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);

			for (let i = 0; i < canvasPoints.length - 1; i++) {
				const current = canvasPoints[i];
				const next = canvasPoints[i + 1];
				const midX = (current.x + next.x) / 2;
				const midY = (current.y + next.y) / 2;
				ctx.quadraticCurveTo(current.x, current.y, midX, midY);
			}

			ctx.stroke();
			ctx.shadowBlur = 0;

			if (!isCrashedRef.current && canvasPoints.length > 0) {
				const lastPoint = canvasPoints[canvasPoints.length - 1];

				const pointGradient = ctx.createRadialGradient(lastPoint.x, lastPoint.y, 0, lastPoint.x, lastPoint.y, 15);
				pointGradient.addColorStop(0, cashedOutRef.current ? "#43b581" : "#5865f2");
				pointGradient.addColorStop(0.7, cashedOutRef.current ? "rgba(67, 181, 129, 0.5)" : "rgba(88, 101, 242, 0.5)");
				pointGradient.addColorStop(1, "transparent");

				ctx.fillStyle = pointGradient;
				ctx.beginPath();
				ctx.arc(lastPoint.x, lastPoint.y, 15, 0, Math.PI * 2);
				ctx.fill();

				ctx.fillStyle = "#ffffff";
				ctx.beginPath();
				ctx.arc(lastPoint.x, lastPoint.y, 6, 0, Math.PI * 2);
				ctx.fill();
			}

			if (isCrashedRef.current && canvasPoints.length > 0) {
				const lastPoint = canvasPoints[canvasPoints.length - 1];
				ctx.fillStyle = "#f04747";
				ctx.beginPath();
				ctx.arc(lastPoint.x, lastPoint.y, 8, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.font = "14px 'Segoe UI', sans-serif";
			ctx.fillStyle = "#8e9297";
			ctx.textAlign = "right";
			ctx.fillText("1.0x", width - 10, height - 10);

			for (let i = 1; i <= 8; i++) {
				const mult = 1 + (i / 8) * (maxValue - 1);
				if (mult > 1.1) {
					const normalizedValue = (mult - 1) / (maxValue - 1);
					const y = height - 30 - normalizedValue * (height - 60);
					if (y >= 20 && y <= height - 40) {
						ctx.fillText(`${mult.toFixed(1)}x`, width - 10, y + 5);
					}
				}
			}

			ctx.textAlign = "center";
			for (let i = 0; i <= 10; i++) {
				const x = (i / 10) * width * 0.9 + width * 0.05;
				const seconds = ((i * maxTime) / 10).toFixed(1);
				ctx.fillText(`${seconds}s`, x, height - 5);
			}
		}
	};

	const startCountdown = (): void => {
		setIsCountingDown(true);
		setCountdown(10);

		countdownIntervalRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					startGame();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const startGame = (): void => {
		if (countdownIntervalRef.current) {
			clearInterval(countdownIntervalRef.current);
		}
		setIsCountingDown(false);

		crashPointRef.current = generateCrashPoint();
		startTimeRef.current = Date.now();
		chartPointsRef.current = [{ time: 0, value: 1.0 }];

		setMultiplier(1.0);
		setIsPlaying(true);
		setIsCrashed(false);
		setCashedOut(false);
		setCashOutMultiplier(0);

		isPlayingRef.current = true;
		isCrashedRef.current = false;
		cashedOutRef.current = false;

		drawChart();

		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}

		let lastFrameTime = 0;
		const gameLoop = (currentTime = 0): void => {
			if (currentTime - lastFrameTime < 16) {
				animationFrameRef.current = requestAnimationFrame(gameLoop);
				return;
			}
			lastFrameTime = currentTime;

			if (!isPlayingRef.current || isCrashedRef.current || cashedOutRef.current) {
				return;
			}

			const elapsed = (Date.now() - startTimeRef.current) / 1000;
			const currentMultiplier = elapsed < 0.1 ? 1.0 : calculateMultiplier(elapsed);

			setMultiplier(currentMultiplier);

			const lastPoint = chartPointsRef.current[chartPointsRef.current.length - 1];
			if (!lastPoint || elapsed - lastPoint.time > 0.05) {
				chartPointsRef.current.push({ time: elapsed, value: currentMultiplier });
				if (chartPointsRef.current.length > 300) {
					chartPointsRef.current = chartPointsRef.current.slice(-300);
				}
			}

			drawChart();

			if (currentMultiplier >= crashPointRef.current) {
				setMultiplier(crashPointRef.current);
				setIsCrashed(true);
				setIsPlaying(false);
				setGameHistory((prev) => [crashPointRef.current, ...prev.slice(0, 9)]);

				isCrashedRef.current = true;
				isPlayingRef.current = false;

				setTimeout(() => drawChart(), 100);

				setTimeout(() => {
					startCountdown();
				}, 3000);
				return;
			}

			if (
				isAutoModeRef.current &&
				currentMultiplier >= autoCashOutRef.current &&
				!cashedOutRef.current &&
				hasActiveBet
			) {
				cashOut();
				return;
			}

			animationFrameRef.current = requestAnimationFrame(gameLoop);
		};

		animationFrameRef.current = requestAnimationFrame(gameLoop);
	};

	const placeBet = (): void => {
		if (bet > balance) {
			alert("Saldo insuficiente!");
			return;
		}

		setBalance((prev) => {
			const newBalance = prev - bet;
			localStorage.setItem("crash-balance", newBalance.toString());
			return newBalance;
		});

		setHasActiveBet(true);
	};

	const cashOut = (): void => {
		if (!hasActiveBet || cashedOutRef.current || isCrashedRef.current) return;

		const winAmount = Math.floor(bet * multiplier);
		setBalance((prev) => {
			const newBalance = prev + winAmount;
			localStorage.setItem("crash-balance", newBalance.toString());
			return newBalance;
		});

		if (multiplier > highestMultiplier) {
			setHighestMultiplier(multiplier);
			localStorage.setItem("crash-highest", multiplier.toString());
		}

		setCashedOut(true);
		setCashOutMultiplier(multiplier);
		setHasActiveBet(false);
		setGameHistory((prev) => [multiplier, ...prev.slice(0, 9)]);

		cashedOutRef.current = true;

		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}
	};

	const addBalance = (): void => {
		setBalance((prev) => {
			const newBalance = prev + 500;
			localStorage.setItem("crash-balance", newBalance.toString());
			return newBalance;
		});
	};

	useEffect(() => {
		isPlayingRef.current = isPlaying;
		isCrashedRef.current = isCrashed;
		cashedOutRef.current = cashedOut;
		isAutoModeRef.current = isAutoMode;
	}, [isPlaying, isCrashed, cashedOut, isAutoMode]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const updateCanvasSize = () => {
			const container = canvas.parentElement;
			if (container) {
				const rect = container.getBoundingClientRect();
				canvas.width = rect.width - 32;
				canvas.height = 500;
				drawChart();
			}
		};

		updateCanvasSize();
		window.addEventListener("resize", updateCanvasSize);

		return () => {
			window.removeEventListener("resize", updateCanvasSize);
		};
	}, []);

	useEffect(() => {
		startCountdown();

		return () => {
			if (countdownIntervalRef.current) {
				clearInterval(countdownIntervalRef.current);
			}
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (isCrashed && hasActiveBet) {
			setHasActiveBet(false);
		}
	}, [isCrashed, hasActiveBet]);

	const getMultiplierColor = (): string => {
		if (isCrashed) return "text-[#f04747]";
		if (cashedOut) return "text-[#43b581]";
		if (multiplier < 2) return "text-[#dcddde]";
		if (multiplier < 5) return "text-[#faa61a]";
		return "text-[#f04747]";
	};

	return (
		<div className="mx-auto w-full">
			<DiscordMessage
				icon={<TrendingUp className="h-5 w-5 text-white" />}
				title="Crash Game"
				badgeText="Risco"
				badgeColor="#f04747"
				subtitle="Jogo de multiplicador com risco - Totalmente responsivo"
			>
				<div className="flex flex-col space-y-6 p-4 lg:grid lg:grid-cols-12 lg:gap-6 lg:space-y-0">
					<div className="lg:col-span-8">
						<div className="relative overflow-hidden rounded-lg border-2 border-[#5865f2] bg-[#2f3136] shadow-2xl">
							<div className="relative w-full p-4">
								<canvas ref={canvasRef} className="w-full rounded-lg" style={{ height: "500px" }} />

								<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
									<div
										className={`text-4xl font-bold transition-all duration-200 sm:text-6xl lg:text-8xl ${getMultiplierColor()} drop-shadow-2xl`}
									>
										{isCountingDown ? `${countdown}s` : `${multiplier.toFixed(2)}x`}
									</div>
								</div>

								<div className="pointer-events-none absolute left-8 right-8 top-8 w-2/3 space-y-2">
									{isCountingDown && (
										<div className="flex items-center justify-center rounded-lg border border-[#faa61a] bg-[#2f3136] bg-opacity-90 p-3 text-center text-lg font-bold text-[#faa61a] sm:text-xl">
											<Clock className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
											Próximo jogo em {countdown}s
										</div>
									)}

									{isCrashed && (
										<div className="flex animate-pulse items-center justify-center rounded-lg border border-[#f04747] bg-[#2f3136] bg-opacity-90 p-3 text-center text-xl font-bold text-[#f04747] sm:text-2xl">
											<Zap className="mr-2 h-6 w-6 sm:h-8 sm:w-8" />
											CRASHED AT {crashPointRef.current.toFixed(2)}x!
										</div>
									)}

									{cashedOut && (
										<div className="flex items-center justify-center rounded-lg border border-[#43b581] bg-[#2f3136] bg-opacity-90 p-3 text-center text-lg font-bold text-[#43b581] sm:text-xl">
											<Target className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
											Cashed Out at {cashOutMultiplier.toFixed(2)}x
										</div>
									)}

									{isPlaying && !cashedOut && !hasActiveBet && (
										<div className="rounded-lg border border-[#40444b] bg-[#2f3136] bg-opacity-90 p-3 text-center text-base text-[#8e9297] sm:text-lg">
											Jogo em andamento - Você pode apostar para a próxima rodada
										</div>
									)}
								</div>
							</div>
						</div>

						{isPlaying && !cashedOut && hasActiveBet && (
							<div className="py-4">
								<Button
									onClick={cashOut}
									className="w-full bg-[#43b581] py-3 text-lg font-bold text-white shadow-2xl transition-all hover:bg-[#3ca374] active:scale-95 sm:py-4 sm:text-xl"
								>
									<Target className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
									Cash Out - {(bet * multiplier).toFixed(0)} coins
								</Button>
							</div>
						)}
					</div>

					<div className="space-y-4 lg:col-span-4">
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
							<div className="rounded-lg border border-[#40444b] bg-[#2f3136] p-3 text-center">
								<div className="text-lg font-bold text-[#43b581] sm:text-xl">{balance}</div>
								<div className="text-xs text-[#8e9297]">Saldo</div>
							</div>
							<div className="rounded-lg border border-[#40444b] bg-[#2f3136] p-3 text-center">
								<div className="text-lg font-bold text-[#faa61a] sm:text-xl">{highestMultiplier.toFixed(2)}x</div>
								<div className="text-xs text-[#8e9297]">Recorde</div>
							</div>
							<div className="rounded-lg border border-[#40444b] bg-[#2f3136] p-3 text-center">
								<div className="text-lg font-bold text-[#5865f2] sm:text-xl">{gameHistory.length}</div>
								<div className="text-xs text-[#8e9297]">Jogos</div>
							</div>
							<div className="rounded-lg border border-[#40444b] bg-[#2f3136] p-3 text-center">
								<div className="text-lg font-bold text-[#f04747] sm:text-xl">{bet}</div>
								<div className="text-xs text-[#8e9297]">Aposta</div>
							</div>
						</div>

						<div className="rounded-lg border border-[#40444b] bg-[#2f3136] p-4">
							<h3 className="mb-3 flex items-center text-base font-bold text-[#ffffff]">
								<DollarSign className="mr-2 h-4 w-4 text-[#43b581]" />
								Controles de Aposta
							</h3>

							<div className="space-y-3">
								<div>
									<label className="mb-1 block text-sm text-[#8e9297]">Valor da Aposta:</label>
									<input
										type="number"
										value={bet}
										onChange={(e) => setBet(Math.max(1, Number.parseInt(e.target.value) || 1))}
										disabled={hasActiveBet}
										className="w-full rounded border-none bg-[#40444b] px-3 py-2 text-[#dcddde] outline-none focus:ring-2 focus:ring-[#5865f2] disabled:opacity-50"
										min="1"
										max={balance}
									/>
								</div>

								<div className="grid grid-cols-2 gap-2">
									<Button
										onClick={() => setBet(Math.floor(balance / 2))}
										disabled={hasActiveBet}
										variant="outline"
										size="sm"
										className="border-[#5865f2] text-[#5865f2] hover:bg-[#5865f2] hover:text-white disabled:opacity-50"
									>
										1/2
									</Button>
									<Button
										onClick={() => setBet(balance)}
										disabled={hasActiveBet}
										variant="outline"
										size="sm"
										className="border-[#f04747] text-[#f04747] hover:bg-[#f04747] hover:text-white disabled:opacity-50"
									>
										Max
									</Button>
								</div>

								<div className="border-t border-[#40444b] pt-3">
									<div className="mb-2 flex items-center space-x-2">
										<input
											type="checkbox"
											checked={isAutoMode}
											onChange={(e) => setIsAutoMode(e.target.checked)}
											disabled={hasActiveBet}
											className="h-4 w-4 rounded"
										/>
										<span className="text-sm text-[#dcddde]">Auto cash out</span>
									</div>
								</div>

								<div className="space-y-2 border-t border-[#40444b] pt-3">
									{!hasActiveBet ? (
										<Button
											onClick={placeBet}
											disabled={bet > balance || bet < 1}
											className="w-full bg-[#43b581] text-white transition-all hover:bg-[#3ca374] active:scale-95 disabled:opacity-50"
										>
											<Rocket className="mr-2 h-5 w-5" />
											{isCountingDown ? `Entrar com ${bet} coins` : `Apostar ${bet} coins (próxima rodada)`}
										</Button>
									) : (
										<div className="rounded-lg border border-[#43b581] bg-[#43b581] bg-opacity-20 p-3 text-center">
											<div className="text-sm font-bold text-[#43b581]">Aposta Ativa: {bet} coins</div>
											<div className="text-xs text-[#8e9297]">
												{isPlaying ? "Aguardando cash out..." : "Aguardando próxima rodada..."}
											</div>
										</div>
									)}

									{balance < 100 && (
										<Button
											onClick={addBalance}
											variant="outline"
											className="w-full border-[#43b581] text-[#43b581] hover:bg-[#43b581] hover:text-white"
										>
											+ 500 coins
										</Button>
									)}
								</div>
							</div>
						</div>

						<div className="rounded-lg border border-[#40444b] bg-[#2f3136] p-4">
							<h3 className="mb-3 flex items-center text-base font-bold text-[#ffffff]">
								<BarChart3 className="mr-2 h-4 w-4 text-[#8e9297]" />
								Histórico
							</h3>

							<div className="max-h-48 space-y-2 overflow-y-auto">
								{gameHistory.length === 0 ? (
									<div className="py-4 text-center text-sm text-[#8e9297]">Nenhum jogo ainda</div>
								) : (
									gameHistory.map((result, index) => (
										<div key={index} className="flex items-center justify-between rounded bg-[#40444b] p-2 text-sm">
											<span className="text-[#8e9297]">#{gameHistory.length - index}</span>
											<span
												className={`font-bold ${
													result < 2 ? "text-[#f04747]" : result < 5 ? "text-[#faa61a]" : "text-[#43b581]"
												}`}
											>
												{Number(result).toFixed(2)}x
											</span>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</DiscordMessage>
		</div>
	);
}
