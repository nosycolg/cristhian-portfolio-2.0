"use client";

import React from "react";
import { useState, useEffect } from "react";

import { servers } from "@/data/servers";
import { loadCurrentUser, saveCurrentUser } from "@/lib/auth";
import type { User } from "@/types/auth";
import DiscordLoading from "@/components/Discord/Components/DiscordLoading";
import AuthScreen from "@/components/Auth";
import DiscordLayout from "@/components/Discord";

export default function Page() {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			const currentUser = loadCurrentUser();
			if (currentUser) {
				setUser(currentUser);
				setIsAuthenticated(true);
			}
			setIsLoading(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	const handleLogin = (user: User) => {
		setUser(user);
		setIsAuthenticated(true);
		saveCurrentUser(user);
	};

	const handleLogout = () => {
		setUser(null);
		setIsAuthenticated(false);
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	};

	if (isLoading) {
		return <DiscordLoading onComplete={() => setIsLoading(false)} />;
	}

	if (!isAuthenticated || !user) {
		return <AuthScreen onLogin={handleLogin} />;
	}

	return (
		<div className="flex h-screen flex-col">
			<div className="flex-1">
				<DiscordLayout servers={servers} user={user} onLogout={handleLogout} />
			</div>
		</div>
	);
}
