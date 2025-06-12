"use client";

import type React from "react";
import { useState } from "react";

import Login from "./Login";
import Register from "./Register";

import type { User } from "@/types/auth";

interface AuthScreenProps {
	onLogin: (user: User) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
	const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-[#2d3035] p-4">
			<div className="relative z-10 w-full max-w-md">
				<div className="rounded-lg bg-[#36393f] p-8 shadow-2xl backdrop-blur-sm">
					<div className="mb-6 text-center">
						<h1 className="mb-2 text-2xl font-semibold text-white">
							{isLogin ? "Boas-vindas de volta!" : "Criar uma conta"}
						</h1>
						<p className="text-sm text-[#b9bbbe]">
							{isLogin ? "Estamos muito animados em vê-lo novamente!" : "Junte-se ao Portfolio Discord!"}
						</p>
					</div>

					{isLogin ? (
						<Login
							onLogin={onLogin}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
							error={error}
							setError={setError}
						/>
					) : (
						<Register
							onLogin={onLogin}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
							error={error}
							setError={setError}
						/>
					)}

					<div className="mt-4 text-sm">
						<span className="text-[#8e9297]">{isLogin ? "Precisando de uma conta?" : "Já tem uma conta?"}</span>
						<button
							onClick={() => {
								setIsLogin(!isLogin);
								setError("");
							}}
							className="text-[#00b0f4] hover:underline"
							disabled={isLoading}
						>
							{isLogin ? "Registre-se" : "Entrar"}
						</button>
					</div>
				</div>

				<div className="mt-6 rounded bg-black bg-opacity-20 p-4 backdrop-blur-sm">
					<p className="mb-2 text-xs text-white">💡 Contas de demonstração:</p>
					<div className="space-y-1 text-xs">
						<p className="text-gray-300">📧 demo@portfolio.com</p>
						<p className="text-gray-300">🔑 Qualquer senha funciona</p>
					</div>
				</div>
			</div>
		</div>
	);
}
