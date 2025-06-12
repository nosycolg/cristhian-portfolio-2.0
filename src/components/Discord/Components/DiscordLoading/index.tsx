"use client";

import { useState, useEffect } from "react";

interface DiscordLoadingProps {
	onComplete: () => void;
}

export default function DiscordLoading({ onComplete }: DiscordLoadingProps) {
	const [progress, setProgress] = useState(0);
	const [currentTip, setCurrentTip] = useState(0);

	const tips = [
		"Carregando servidores...",
		"Conectando com amigos...",
		"Sincronizando mensagens...",
		"Preparando interface...",
		"Quase pronto...",
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				const newProgress = prev + Math.random() * 15 + 5;

				if (newProgress >= 100) {
					clearInterval(interval);
					setTimeout(onComplete, 500);
					return 100;
				}

				return newProgress;
			});
		}, 300);

		return () => clearInterval(interval);
	}, [onComplete]);

	useEffect(() => {
		const tipInterval = setInterval(() => {
			setCurrentTip((prev) => (prev + 1) % tips.length);
		}, 1000);

		return () => clearInterval(tipInterval);
	}, [tips.length]);

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-[#36393f]">
			<div className="text-center">
				<div className="mb-8">
					<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#5865f2]">
						<img className="h-full w-full rounded-3xl object-cover" src={"/cristhian-profile.jpeg"} />
					</div>
					<h1 className="text-2xl font-semibold text-[#ffffff]">Portfolio Cristhian Felipe</h1>
					<h1 className="text-xl font-semibold text-gray-400">Baseado no Discord</h1>
				</div>

				<div className="mx-auto mb-6 w-80">
					<div className="mb-4 h-2 w-full rounded-full bg-[#202225]">
						<div
							className="h-2 rounded-full bg-[#5865f2] transition-all duration-300 ease-out"
							style={{ width: `${Math.min(progress, 100)}%` }}
						></div>
					</div>
					<div className="text-sm text-[#b9bbbe]">{Math.round(Math.min(progress, 100))}%</div>
				</div>

				<div className="h-6 text-sm text-[#8e9297]">
					<div className="animate-pulse">{tips[currentTip]}</div>
				</div>

				<div className="mt-6 flex justify-center space-x-1">
					<div className="h-2 w-2 animate-bounce rounded-full bg-[#5865f2]"></div>
					<div className="h-2 w-2 animate-bounce rounded-full bg-[#5865f2]" style={{ animationDelay: "0.1s" }}></div>
					<div className="h-2 w-2 animate-bounce rounded-full bg-[#5865f2]" style={{ animationDelay: "0.2s" }}></div>
				</div>
			</div>
		</div>
	);
}
