import { File, Image, Paperclip } from "lucide-react";

import { FileItem, FileFolder, FileUploadResponse } from "../types/file-manager";

const STORAGE_PREFIX = "file_manager_";
const FILES_KEY = `${STORAGE_PREFIX}files`;
const FOLDERS_KEY = `${STORAGE_PREFIX}folders`;

const DEFAULT_FOLDERS: FileFolder[] = [
	{ id: "images", name: "Imagens", icon: Image, color: "#f7b731" },
	{ id: "documents", name: "Documentos", icon: File, color: "#3498db" },
	{ id: "shared", name: "Compartilhados", icon: Paperclip, color: "#9b59b6" },
];

export const loadFolders = (): FileFolder[] => {
	try {
		const stored = localStorage.getItem(FOLDERS_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
		saveFolders(DEFAULT_FOLDERS);
		return DEFAULT_FOLDERS;
	} catch (error) {
		console.error("Erro ao carregar pastas:", error);
		return DEFAULT_FOLDERS;
	}
};

export const saveFolders = (folders: FileFolder[]): void => {
	try {
		localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
	} catch (error) {
		console.error("Erro ao salvar pastas:", error);
	}
};

export const loadFiles = (): FileItem[] => {
	try {
		const stored = localStorage.getItem(FILES_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			return parsed.map((file: FileItem) => ({
				...file,
				uploadedAt: new Date(file.uploadedAt),
			}));
		}
		return [];
	} catch (error) {
		console.error("Erro ao carregar arquivos:", error);
		return [];
	}
};

export const saveFiles = (files: FileItem[]): void => {
	try {
		localStorage.setItem(
			FILES_KEY,
			JSON.stringify(
				files.map((file) => ({
					...file,
					uploadedAt: file.uploadedAt.toISOString(),
				})),
			),
		);
	} catch (error) {
		console.error("Erro ao salvar arquivos:", error);
	}
};

export const addFile = (file: FileItem): void => {
	const files = loadFiles();
	saveFiles([...files, file]);
};

export const removeFile = (fileId: string): void => {
	const files = loadFiles();
	saveFiles(files.filter((file) => file.id !== fileId));
};

export const getFilesByFolder = (folderId: string): FileItem[] => {
	const files = loadFiles();
	return files.filter((file) => file.folderId === folderId);
};

export const uploadToImgBB = async (file: File): Promise<FileUploadResponse> => {
	try {
		const formData = new FormData();
		formData.append("image", file);

		const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "2a7e7e4f5922a8d9d0e3b3e3e3e3e3e3";

		formData.append("key", apiKey);

		const response = await fetch("https://api.imgbb.com/1/upload", {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`Erro ao fazer upload: ${response.status}`);
		}

		const data = await response.json();

		if (data.success) {
			return {
				success: true,
				url: data.data.url,
				thumbnailUrl: data.data.thumb?.url || data.data.url,
			};
		} else {
			throw new Error("Falha no upload");
		}
	} catch (error) {
		console.error("Erro no upload:", error);

		return simulateUpload(file);
	}
};

const simulateUpload = (file: File): Promise<FileUploadResponse> => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			setTimeout(() => {
				resolve({
					success: true,
					url: reader.result as string,
					thumbnailUrl: reader.result as string,
				});
			}, 1500);
		};
		reader.readAsDataURL(file);
	});
};
