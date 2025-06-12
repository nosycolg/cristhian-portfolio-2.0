"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { User, Loader2, Download, Share2, X, Paperclip, Check, LucideImage, Clock, Folder } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { saveChatMessages, loadChatMessages } from "@/lib/chat-storage";
import { uploadToImgBB } from "@/lib/file-storage";
import { Button } from "@/components/ui/button";
import { IChatMessage, FileChatProps, ImagePreview } from "@/types/chat-message";

export function ChatMessage({ channelId, channelName, welcomeMessage }: FileChatProps) {
	const [messages, setMessages] = useState<IChatMessage[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
	const [selectedImage, setSelectedImage] = useState<IChatMessage | null>(null);
	const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const savedMessages: IChatMessage[] = loadChatMessages(channelId);

		if (savedMessages.length > 0) {
			setMessages(savedMessages);
		} else {
			const welcomeMsg: IChatMessage = {
				id: "welcome",
				content: welcomeMessage,
				role: "assistant",
				timestamp: new Date(),
				type: "text",
			};
			setMessages([welcomeMsg]);
			saveChatMessages(channelId, [welcomeMsg]);
		}

		setIsInitialized(true);
	}, [channelId, welcomeMessage]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (isInitialized) {
			scrollToBottom();
		}
	}, [messages, isInitialized]);

	const handleConfirmImage = async () => {
		if (!imagePreview) return;

		setIsUploading(true);
		setImagePreview(null);

		try {
			const result = await uploadToImgBB(imagePreview.file);

			if (result.success) {
				const imageMessage: IChatMessage = {
					id: Date.now().toString(),
					content: `**${imagePreview.file.name}**`,
					role: "user",
					timestamp: new Date(),
					type: "image",
					imageUrl: result.url,
					imageName: imagePreview.file.name,
					imageSize: imagePreview.file.size,
				};

				setMessages((prev) => [...prev, imageMessage]);
				setImagePreview(null);
			} else {
				alert("Erro ao fazer upload da imagem.");
			}
		} catch (error) {
			console.error("Erro no upload:", error);
			alert("Erro ao fazer upload da imagem.");
		} finally {
			setIsUploading(false);
		}
	};

	const handleCancelImage = () => {
		if (imagePreview?.previewUrl) {
			URL.revokeObjectURL(imagePreview.previewUrl);
		}
		setImagePreview(null);
	};

	const handleFileSelect = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];

			if (!file.type.startsWith("image/")) {
				alert("Por favor, selecione apenas arquivos de imagem.");
				return;
			}

			const previewUrl = URL.createObjectURL(file);
			setImagePreview({ file, previewUrl });
		}
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDate = (date: Date) => {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return "Hoje";
		} else if (date.toDateString() === yesterday.toDateString()) {
			return "Ontem";
		} else {
			return date.toLocaleDateString("pt-BR", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			});
		}
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const groupMessagesByDate = (messages: IChatMessage[]) => {
		const groups: { [key: string]: IChatMessage[] } = {};

		messages.forEach((message) => {
			const dateKey = message.timestamp.toDateString();
			if (!groups[dateKey]) {
				groups[dateKey] = [];
			}
			groups[dateKey].push(message);
		});

		return groups;
	};

	const messageGroups = groupMessagesByDate(messages);

	if (!isInitialized) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="flex items-center space-x-2 text-[#8e9297]">
					<Loader2 className="h-4 w-4 animate-spin" />
					<span>Carregando conversa...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			<div className="content-scrollbar flex-1 space-y-4 overflow-y-auto px-4 pb-4">
				{Object.entries(messageGroups).map(([dateKey, dayMessages]) => (
					<div key={dateKey}>
						<div className="flex items-center justify-center">
							<div className="rounded-full bg-[#40444b] px-3 py-1">
								<span className="text-xs font-medium text-[#8e9297]">{formatDate(new Date(dateKey))}</span>
							</div>
						</div>

						<div className="space-y-4">
							{dayMessages.map((message) => (
								<div key={message.id} className="message-animate group flex items-start space-x-3">
									<div
										className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full md:h-10 md:w-10 ${
											message.role === "assistant" ? "bg-[#f7b731]" : "bg-[#5865f2]"
										}`}
									>
										{message.role === "assistant" ? (
											<span className="text-xs font-bold text-white">
												<LucideImage />
											</span>
										) : (
											<img className="h-full w-full rounded-full object-cover" src={"/cristhian-profile.jpeg"} />
										)}
									</div>
									<div className="min-w-0 flex-1">
										<div className="mb-1 flex items-center space-x-2">
											<span className="text-sm font-medium text-[#ffffff]">
												{message.role === "assistant" ? channelName : "Cristhian Felipe"}
											</span>
											<span className="text-xs text-[#72767d]">{formatTime(message.timestamp)}</span>
										</div>

										{message.type === "text" && (
											<div className="text-sm leading-relaxed text-[#dcddde]">
												{message.role === "assistant" ? (
													<ReactMarkdown>{message.content}</ReactMarkdown>
												) : (
													<div className="whitespace-pre-wrap">{message.content}</div>
												)}
											</div>
										)}

										{message.type === "image" && message.imageUrl && (
											<div className="space-y-2">
												<div
													className="group/image relative max-w-sm cursor-pointer"
													onClick={() => setSelectedImage(message)}
												>
													<img
														src={message.imageUrl || "/placeholder.svg"}
														alt={message.imageName || "Imagem"}
														className="h-auto max-w-full rounded-lg shadow-lg transition-transform hover:scale-[1.02]"
														style={{ maxHeight: "300px" }}
													/>
												</div>
												{/* {message.imageSize && (
                          <div className="text-[#8e9297] text-xs">📁 {formatFileSize(message.imageSize)}</div>
                        )} */}
											</div>
										)}

										{/* Ações da mensagem */}
										{/* <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[#8e9297] hover:text-[#dcddde]"
                        onClick={() => copyToClipboard(message.imageUrl || message.content)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copiar
                      </Button>
                      {message.type === "image" && message.imageUrl && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-[#8e9297] hover:text-[#dcddde]"
                            onClick={() => window.open(message.imageUrl, "_blank")}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-[#8e9297] hover:text-[#dcddde]"
                            onClick={() => {
                              navigator.clipboard.writeText(message.imageUrl!)
                              alert("URL da imagem copiada!")
                            }}
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            Compartilhar
                          </Button>
                        </>
                      )}
                    </div> */}
									</div>
								</div>
							))}
						</div>
					</div>
				))}

				{isUploading && (
					<div className="flex items-start space-x-3">
						<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#5865f2] md:h-10 md:w-10">
							<User className="h-4 w-4 text-white md:h-5 md:w-5" />
						</div>
						<div className="min-w-0 flex-1">
							<div className="mb-1 flex items-center space-x-2">
								<span className="text-sm font-medium text-[#ffffff]">Você</span>
								<span className="text-xs text-[#72767d]">enviando imagem...</span>
							</div>
							<div className="flex items-center space-x-2 text-[#8e9297]">
								<Loader2 className="h-4 w-4 animate-spin" />
								<span className="text-sm">Fazendo upload da imagem...</span>
							</div>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			<div className="border-t border-[#202225] p-4">
				<div className="flex items-center justify-center">
					<Button
						type="button"
						onClick={handleFileSelect}
						disabled={isUploading || !!imagePreview}
						className="rounded-lg bg-[#f7b731] px-6 py-3 text-white hover:bg-[#f0ad4e]"
					>
						<Paperclip className="mr-2 h-5 w-5" />
						{isUploading ? "Enviando..." : "Selecionar Imagem"}
					</Button>
					<input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
				</div>
				<div className="mt-2 text-center text-xs text-[#72767d]">
					📎 Clique para selecionar uma imagem • Apenas imagens são permitidas
				</div>
			</div>

			{imagePreview && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
					<div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-[#36393f]">
						<div className="flex items-center justify-between border-b border-[#202225] p-4">
							<div>
								<h3 className="font-medium text-[#ffffff]">Preview da Imagem</h3>
								<p className="text-sm text-[#8e9297]">
									{imagePreview.file.name} • {formatFileSize(imagePreview.file.size)}
								</p>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 text-[#8e9297] hover:text-[#ffffff]"
								onClick={handleCancelImage}
								disabled={isUploading}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
						<div className="flex flex-1 items-center justify-center overflow-auto bg-[#2f3136] p-4">
							<img
								src={imagePreview.previewUrl || "/placeholder.svg"}
								alt="Preview"
								className="max-h-[60vh] max-w-full rounded-lg object-contain"
							/>
						</div>
						<div className="flex items-center justify-between border-t border-[#202225] p-4">
							<div className="text-sm text-[#8e9297]">
								<div>📁 {formatFileSize(imagePreview.file.size)}</div>
								<div>🖼️ {imagePreview.file.type}</div>
							</div>
							<div className="flex items-center space-x-2">
								<Button
									variant="ghost"
									size="sm"
									className="text-[#f04747] hover:bg-[#f04747] hover:text-white"
									onClick={handleCancelImage}
									disabled={isUploading}
								>
									<X className="mr-2 h-4 w-4" />
									Cancelar
								</Button>
								<Button
									size="sm"
									className="bg-[#43b581] text-white hover:bg-[#3ca374]"
									onClick={handleConfirmImage}
									disabled={isUploading}
								>
									{isUploading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Enviando...
										</>
									) : (
										<>
											<Check className="mr-2 h-4 w-4" />
											Enviar Imagem
										</>
									)}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{selectedImage && selectedImage.imageUrl && (
				<div
					className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-75 p-4"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setSelectedImage(null);
						}
					}}
				>
					<div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-[#36393f]">
						<div className="flex items-center justify-between border-b border-[#202225] p-4">
							<div>
								<h3 className="font-medium text-[#ffffff]">{selectedImage.imageName || "Imagem"}</h3>
								<p className="text-sm text-[#8e9297]">
									Enviado por {selectedImage.role === "user" ? "Você" : channelName} •{" "}
									{formatTime(selectedImage.timestamp)}
								</p>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 text-[#8e9297] hover:text-[#ffffff]"
								onClick={() => setSelectedImage(null)}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
						<div className="flex flex-1 items-center justify-center overflow-auto bg-[#2f3136] p-4">
							<img
								src={selectedImage.imageUrl || "/placeholder.svg"}
								alt={selectedImage.imageName || "Imagem"}
								className="max-h-[70vh] max-w-full rounded-xl object-contain"
							/>
						</div>
						<div className="flex items-center justify-between border-t border-[#202225] p-4">
							<div className="text-sm text-[#8e9297]">
								{selectedImage.imageSize && (
									<div className="flex items-center justify-start gap-1">
										<Folder className="h-4 w-4" /> {formatFileSize(selectedImage.imageSize)}
									</div>
								)}
								<div className="flex items-center gap-1">
									<Clock className="h-4 w-4" /> {formatDate(selectedImage.timestamp)}
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<Button
									variant="ghost"
									size="sm"
									className="text-[#00b0f4] hover:bg-[#00b0f4] hover:text-white"
									onClick={() => window.open(selectedImage.imageUrl, "_blank")}
								>
									<Download className="mr-2 h-4 w-4" />
									Download
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="text-[#43b581] hover:bg-[#43b581] hover:text-white"
									onClick={() => {
										navigator.clipboard.writeText(selectedImage.imageUrl!);
										alert("URL copiada para a área de transferência!");
									}}
								>
									<Share2 className="mr-2 h-4 w-4" />
									Compartilhar
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
