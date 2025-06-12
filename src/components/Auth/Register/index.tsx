"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { register } from "@/lib/auth";
import type { User } from "@/types/auth";
import { Button } from "@/components/ui/button";

interface RegisterProps {
	onLogin: (user: User) => void;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	error: string;
	setError: (error: string) => void;
}

export default function Register({ onLogin, isLoading, setIsLoading, error, setError }: RegisterProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			if (!formData.username.trim()) {
				setError("Nome de usuário é obrigatório");
				setIsLoading(false);
				return;
			}
			const result = await register(formData.username, formData.email, formData.password);
			if (result.success && result.user) {
				onLogin(result.user);
			} else {
				setError(result.message);
			}
		} catch {
			setError("Ocorreu um erro. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (error) setError("");
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#b9bbbe]">
					Nome de usuário *
				</label>
				<div className="relative">
					<input
						type="text"
						value={formData.username}
						onChange={(e) => handleInputChange("username", e.target.value)}
						className="w-full rounded border-none bg-[#202225] px-4 py-3 text-[#dcddde] outline-none transition-all focus:ring-2 focus:ring-[#5865f2]"
						placeholder="Digite seu nome de usuário"
						disabled={isLoading}
					/>
				</div>
			</div>

			<div>
				<label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#b9bbbe]">E-mail *</label>
				<div className="relative">
					<input
						type="email"
						value={formData.email}
						onChange={(e) => handleInputChange("email", e.target.value)}
						className="w-full rounded border-none bg-[#202225] px-4 py-3 text-[#dcddde] outline-none transition-all focus:ring-2 focus:ring-[#5865f2]"
						placeholder="Digite seu email"
						disabled={isLoading}
						required
					/>
				</div>
			</div>

			<div>
				<label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#b9bbbe]">Senha *</label>
				<div className="relative">
					<input
						type={showPassword ? "text" : "password"}
						value={formData.password}
						onChange={(e) => handleInputChange("password", e.target.value)}
						className="w-full rounded border-none bg-[#202225] px-4 py-3 pr-12 text-[#dcddde] outline-none transition-all focus:ring-2 focus:ring-[#5865f2]"
						placeholder="Digite sua senha"
						disabled={isLoading}
						required
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 transform text-[#8e9297] transition-colors hover:text-[#dcddde]"
						disabled={isLoading}
					>
						{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
					</button>
				</div>
			</div>

			{error && (
				<div className="rounded border border-[#f04747] bg-[#f04747] bg-opacity-10 p-3">
					<p className="text-sm text-[#f04747]">{error}</p>
				</div>
			)}

			<Button
				type="submit"
				disabled={isLoading}
				className="w-full rounded bg-[#5865f2] py-3 font-medium text-white transition-all hover:bg-[#4752c4]"
			>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Criando conta...
					</>
				) : (
					<>Continuar</>
				)}
			</Button>
		</form>
	);
}
