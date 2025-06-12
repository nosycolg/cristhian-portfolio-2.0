import type { User } from "../types/auth.ts";

const USERS_KEY = "discord_users";
const CURRENT_USER_KEY = "discord_current_user";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const loadUsers = (): User[] => {
	try {
		const stored = localStorage.getItem(USERS_KEY);
		if (stored) {
			const users = JSON.parse(stored);
			return users.map((user: User) => ({
				...user,
				createdAt: new Date(user.createdAt),
			}));
		}
		return [];
	} catch (error) {
		console.error("Erro ao carregar usuários:", error);
		return [];
	}
};

const saveUsers = (users: User[]): void => {
	try {
		const usersToSave = users.map((user) => ({
			...user,
			createdAt: user.createdAt.toISOString(),
		}));
		localStorage.setItem(USERS_KEY, JSON.stringify(usersToSave));
	} catch (error) {
		console.error("Erro ao salvar usuários:", error);
	}
};

export const register = async (
	username: string,
	email: string,
): Promise<{ success: boolean; message: string; user?: User }> => {
	await delay(1500);

	const users = loadUsers();

	if (users.find((user) => user.email === email)) {
		return { success: false, message: "Este email já está em uso." };
	}

	if (users.find((user) => user.username === username)) {
		return { success: false, message: "Este nome de usuário já está em uso." };
	}

	const newUser: User = {
		id: `user_${Date.now()}`,
		username,
		email,
		status: "online",
		customStatus: "Novo no Discord!",
		createdAt: new Date(),
	};

	users.push(newUser);
	saveUsers(users);

	return { success: true, message: "Conta criada com sucesso!", user: newUser };
};

export const login = async (email: string): Promise<{ success: boolean; message: string; user?: User }> => {
	await delay(1200);

	const users = loadUsers();
	const user = users.find((u) => u.email === email);

	if (!user) {
		return { success: false, message: "Email ou senha incorretos." };
	}

	return { success: true, message: "Login realizado com sucesso!", user };
};

export const saveCurrentUser = (user: User): void => {
	try {
		const userToSave = {
			...user,
			createdAt: user.createdAt.toISOString(),
		};
		localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToSave));
	} catch (error) {
		console.error("Erro ao salvar usuário atual:", error);
	}
};

export const loadCurrentUser = (): User | null => {
	try {
		const stored = localStorage.getItem(CURRENT_USER_KEY);
		if (stored) {
			const user = JSON.parse(stored);
			return {
				...user,
				createdAt: new Date(user.createdAt),
			};
		}
		return null;
	} catch (error) {
		console.error("Erro ao carregar usuário atual:", error);
		return null;
	}
};

export const logout = (): void => {
	localStorage.removeItem(CURRENT_USER_KEY);
};

export const updateUserStatus = (status: User["status"], customStatus?: string): void => {
	const currentUser = loadCurrentUser();
	if (currentUser) {
		const updatedUser = {
			...currentUser,
			status,
			customStatus,
		};
		saveCurrentUser(updatedUser);

		const users = loadUsers();
		const userIndex = users.findIndex((u) => u.id === currentUser.id);
		if (userIndex !== -1) {
			users[userIndex] = updatedUser;
			saveUsers(users);
		}
	}
};
