"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, Mic, MicOff, Headphones, LogOut, Edit3, Check, X } from "lucide-react";

import type { User } from "@/types/auth";
import { updateUserStatus, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";

interface UserAreaProps {
	user: User;
	onLogout: () => void;
}

export default function UserArea({ user, onLogout }: UserAreaProps) {
	const [showStatusMenu, setShowStatusMenu] = useState(false);
	const [isEditingStatus, setIsEditingStatus] = useState(false);
	const [customStatus, setCustomStatus] = useState(user.customStatus || "");
	const [isMuted, setIsMuted] = useState(false);
	const [isDeafened, setIsDeafened] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const statusOptions = [
		{ value: "online", label: "Online", color: "#43b581", emoji: "🟢" },
		{ value: "idle", label: "Ausente", color: "#faa61a", emoji: "🌙" },
		{ value: "dnd", label: "Não perturbe", color: "#f04747", emoji: "⛔" },
		{ value: "invisible", label: "Invisível", color: "#747f8d", emoji: "⚫" },
	] as const;

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setShowStatusMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (isEditingStatus && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditingStatus]);

	const handleStatusChange = (newStatus: User["status"]) => {
		updateUserStatus(newStatus, customStatus);
		setShowStatusMenu(false);
		window.location.reload();
	};

	const handleCustomStatusSave = () => {
		updateUserStatus(user.status, customStatus);
		setIsEditingStatus(false);
		window.location.reload();
	};

	const handleCustomStatusCancel = () => {
		setCustomStatus(user.customStatus || "");
		setIsEditingStatus(false);
	};

	const handleLogout = () => {
		logout();
		onLogout();
	};

	const currentStatusOption = statusOptions.find((option) => option.value === user.status);

	return (
		<div className="relative flex h-[52px] items-center bg-[#292b2f] px-2">
			<div className="flex min-w-0 flex-1 items-center space-x-2">
				<div className="relative flex-shrink-0">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865f2]">
						<span className="text-xs font-bold text-white">{user.username.substring(0, 2).toUpperCase()}</span>
					</div>
					<div
						className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#292b2f]"
						style={{ backgroundColor: currentStatusOption?.color }}
					></div>
				</div>
				<div className="min-w-0 flex-1 cursor-pointer" onClick={() => setShowStatusMenu(!showStatusMenu)}>
					<div className="truncate text-sm font-medium text-[#ffffff]">{user.username}</div>
					<div className="truncate text-xs text-[#b9bbbe]">
						{isEditingStatus ? (
							<div className="flex items-center space-x-1">
								<input
									ref={inputRef}
									type="text"
									value={customStatus}
									onChange={(e) => setCustomStatus(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === "Enter") handleCustomStatusSave();
										if (e.key === "Escape") handleCustomStatusCancel();
									}}
									className="w-full rounded bg-[#40444b] px-2 py-1 text-xs text-[#dcddde]"
									placeholder="Definir status personalizado"
									maxLength={128}
								/>
								<Button
									variant="ghost"
									size="sm"
									className="h-5 w-5 p-0 text-[#43b581] hover:text-[#3ca374]"
									onClick={handleCustomStatusSave}
								>
									<Check className="h-3 w-3" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="h-5 w-5 p-0 text-[#f04747] hover:text-[#e03e3e]"
									onClick={handleCustomStatusCancel}
								>
									<X className="h-3 w-3" />
								</Button>
							</div>
						) : (
							<div className="flex items-center space-x-1">
								<span>{currentStatusOption?.emoji}</span>
								<span>{user.customStatus || currentStatusOption?.label}</span>
								<Button
									variant="ghost"
									size="sm"
									className="h-4 w-4 p-0 text-[#8e9297] opacity-0 hover:text-[#dcddde] group-hover:opacity-100"
									onClick={(e) => {
										e.stopPropagation();
										setIsEditingStatus(true);
									}}
								>
									<Edit3 className="h-3 w-3" />
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex items-center space-x-1">
				<Button
					variant="ghost"
					size="sm"
					className={`h-8 w-8 p-0 ${isMuted ? "text-[#f04747]" : "text-[#b9bbbe] hover:text-[#dcddde]"}`}
					onClick={() => setIsMuted(!isMuted)}
				>
					{isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className={`h-8 w-8 p-0 ${isDeafened ? "text-[#f04747]" : "text-[#b9bbbe] hover:text-[#dcddde]"}`}
					onClick={() => setIsDeafened(!isDeafened)}
				>
					<Headphones className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 p-0 text-[#b9bbbe] hover:text-[#dcddde]"
					onClick={() => setShowStatusMenu(!showStatusMenu)}
				>
					<Settings className="h-4 w-4" />
				</Button>
			</div>

			{showStatusMenu && (
				<div
					ref={menuRef}
					className="absolute bottom-full left-2 z-50 mb-2 w-64 rounded-lg border border-[#202225] bg-[#18191c] shadow-xl"
				>
					<div className="border-b border-[#202225] p-4">
						<div className="flex items-center space-x-3">
							<div className="relative">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5865f2]">
									<span className="font-bold text-white">{user.username.substring(0, 2).toUpperCase()}</span>
								</div>
								<div
									className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#18191c]"
									style={{ backgroundColor: currentStatusOption?.color }}
								></div>
							</div>
							<div>
								<div className="font-medium text-[#ffffff]">{user.username}</div>
								<div className="text-sm text-[#b9bbbe]">{user.email}</div>
							</div>
						</div>
					</div>

					<div className="p-2">
						{statusOptions.map((option) => (
							<button
								key={option.value}
								onClick={() => handleStatusChange(option.value)}
								className={`flex w-full items-center space-x-3 rounded px-3 py-2 transition-colors hover:bg-[#36393f] ${
									user.status === option.value ? "bg-[#36393f]" : ""
								}`}
							>
								<div className="h-3 w-3 rounded-full" style={{ backgroundColor: option.color }}></div>
								<span className="text-sm text-[#dcddde]">{option.label}</span>
							</button>
						))}
					</div>

					<div className="border-t border-[#202225] p-2">
						<button
							onClick={() => setIsEditingStatus(true)}
							className="flex w-full items-center space-x-3 rounded px-3 py-2 transition-colors hover:bg-[#36393f]"
						>
							<Edit3 className="h-4 w-4 text-[#b9bbbe]" />
							<span className="text-sm text-[#dcddde]">Definir status personalizado</span>
						</button>
						<button
							onClick={handleLogout}
							className="flex w-full items-center space-x-3 rounded px-3 py-2 transition-colors hover:bg-[#f04747] hover:text-white"
						>
							<LogOut className="h-4 w-4 text-[#f04747]" />
							<span className="text-sm text-[#f04747]">Sair</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
