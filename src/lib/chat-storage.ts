import { IChatMessage } from "@/types/chat-message";

export interface StoredMessage {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: string;
}

export interface ChatMetadata {
	channelId: string;
	lastActivity: string;
	messageCount: number;
	createdAt: string;
}

const STORAGE_PREFIX = "ai_chat_";
const METADATA_KEY = "ai_chat_metadata";

export const saveChatMessages = (channelId: string, messages: IChatMessage[]) => {
	try {
		const storageKey = `${STORAGE_PREFIX}${channelId}`;
		const storedMessages: StoredMessage[] = messages.map((msg) => ({
			...msg,
			timestamp: msg.timestamp.toISOString(),
		}));

		localStorage.setItem(storageKey, JSON.stringify(storedMessages));
		updateChatMetadata(channelId, messages.length);

		return true;
	} catch (error) {
		console.error("Erro ao salvar mensagens:", error);
		return false;
	}
};

export const loadChatMessages = (channelId: string) => {
	try {
		const storageKey = `${STORAGE_PREFIX}${channelId}`;
		const stored = localStorage.getItem(storageKey);

		if (stored) {
			const parsed: IChatMessage[] = JSON.parse(stored);
			return parsed.map((msg) => ({
				...msg,
				timestamp: new Date(msg.timestamp),
			}));
		}
	} catch (error) {
		console.error("Erro ao carregar mensagens:", error);
	}

	return [];
};

const updateChatMetadata = (channelId: string, messageCount: number) => {
	try {
		const metadata = getChatMetadata();
		const now = new Date().toISOString();

		metadata[channelId] = {
			channelId,
			lastActivity: now,
			messageCount,
			createdAt: metadata[channelId]?.createdAt || now,
		};

		localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
	} catch (error) {
		console.error("Erro ao atualizar metadados:", error);
	}
};

export const getChatMetadata = (): Record<string, ChatMetadata> => {
	try {
		const stored = localStorage.getItem(METADATA_KEY);
		return stored ? JSON.parse(stored) : {};
	} catch (error) {
		console.error("Erro ao carregar metadados:", error);
		return {};
	}
};

export const getChatStats = () => {
	const metadata = getChatMetadata();
	const channels = Object.keys(metadata);

	const totalMessages = channels.reduce((sum, channelId) => {
		return sum + (metadata[channelId]?.messageCount || 0);
	}, 0);

	const lastActivity = channels.reduce(
		(latest, channelId) => {
			const activity = metadata[channelId]?.lastActivity;
			if (!activity) return latest;

			const activityDate = new Date(activity);
			return !latest || activityDate > latest ? activityDate : latest;
		},
		null as Date | null,
	);

	return {
		totalChannels: channels.length,
		totalMessages,
		lastActivity,
		channels: metadata,
	};
};

export const exportAllChats = () => {
	try {
		const allData: Record<string, unknown> = {};
		const metadata = getChatMetadata();

		Object.keys(metadata).forEach((channelId) => {
			const messages = loadChatMessages(channelId);
			allData[channelId] = {
				metadata: metadata[channelId],
				messages,
			};
		});

		return {
			exportDate: new Date().toISOString(),
			version: "1.0",
			data: allData,
		};
	} catch (error) {
		console.error("Erro ao exportar chats:", error);
		return null;
	}
};

export const getStorageInfo = () => {
	try {
		const used = new Blob(Object.values(localStorage)).size;
		const total = 5 * 1024 * 1024;

		return {
			used,
			total,
			available: total - used,
			usedPercentage: (used / total) * 100,
		};
	} catch {
		return {
			used: 0,
			total: 0,
			available: 0,
			usedPercentage: 0,
		};
	}
};
