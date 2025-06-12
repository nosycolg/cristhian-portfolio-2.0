import { LucideIcon } from "lucide-react";

export interface FileItem {
	id: string;
	name: string;
	url: string;
	thumbnailUrl?: string;
	type: string;
	size: number;
	uploadedAt: Date;
	folderId: string;
}

export interface FileFolder {
	id: string;
	name: string;
	icon: LucideIcon;
	color: string;
}

export interface FileUploadResponse {
	success: boolean;
	url: string;
	thumbnailUrl?: string;
	error?: string;
}
