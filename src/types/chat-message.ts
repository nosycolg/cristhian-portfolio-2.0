import { LucideIcon } from "lucide-react";

export interface IChatMessage {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: Date;
	type: "text" | "image";
	imageUrl?: string;
	imageName?: string;
	imageSize?: number;
}

export interface FileChatProps {
	channelId: string;
	channelName: string;
	channelIcon: LucideIcon;
	placeholder: string;
	welcomeMessage: string;
}

export interface ImagePreview {
	file: File;
	previewUrl: string;
}
