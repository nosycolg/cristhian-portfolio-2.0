"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "@/components/ui/button";
import { getAIResponse } from "@/services/grok.service";
import { loadChatMessages, saveChatMessages } from "@/lib/chat-storage";
import { IChatMessage } from "@/types/chat-message";

interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: Date;
}

interface VirtualAssistantProps {
	systemPrompt: string;
	placeholder: string;
	welcomeMessage: string;
	chatType: string;
	channelId: string;
}

export function VirtualAssistant({
	systemPrompt,
	placeholder,
	welcomeMessage,
	chatType,
	channelId,
}: VirtualAssistantProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		const savedMessages = loadChatMessages(channelId);

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			content: input.trim(),
			role: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		const currentInput = input.trim();
		setInput("");
		setIsLoading(true);

		try {
			const response = await getAIResponse(currentInput, systemPrompt, chatType);

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: response,
				role: "assistant",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			console.error("Erro ao obter resposta da IA:", error);
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				content:
					"❌ **Erro de Conexão**\n\nDesculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.\n\n*Dica: Verifique sua conexão com a internet.*",
				role: "assistant",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
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

	const groupMessagesByDate = (messages: Message[]) => {
		const groups: { [key: string]: Message[] } = {};

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
											message.role === "assistant" ? "bg-[#00d4aa]" : "bg-[#5865f2]"
										}`}
									>
										{message.role === "assistant" ? (
											<Bot className="h-4 w-4 text-white md:h-5 md:w-5" />
										) : (
											<User className="h-4 w-4 text-white md:h-5 md:w-5" />
										)}
									</div>
									<div className="min-w-0 flex-1">
										<div className="mb-1 flex items-center space-x-2">
											<span className="text-sm font-medium text-[#ffffff]">
												{message.role === "assistant" ? "AI Assistant" : "Você"}
											</span>
											<span className="text-xs text-[#72767d]">{formatTime(message.timestamp)}</span>
										</div>
										<div className="text-sm leading-relaxed text-[#dcddde]">
											{message.role === "assistant" ? (
												<ReactMarkdown
													components={{
														code({ className, children, ...props }) {
															const match = /language-(\w+)/.exec(className || "");
															return match ? (
																<SyntaxHighlighter
																	style={oneDark}
																	language={match[1]}
																	PreTag="div"
																	className="my-2 rounded-md"
																	{...props}
																>
																	{String(children).replace(/\n$/, "")}
																</SyntaxHighlighter>
															) : (
																<code
																	className="rounded bg-[#2f3136] px-1.5 py-0.5 font-mono text-xs text-[#00d4aa]"
																	{...props}
																>
																	{children}
																</code>
															);
														},
														p({ children }) {
															return <p className="mb-2 last:mb-0">{children}</p>;
														},
														ul({ children }) {
															return <ul className="mb-2 list-inside list-disc space-y-1">{children}</ul>;
														},
														ol({ children }) {
															return <ol className="mb-2 list-inside list-decimal space-y-1">{children}</ol>;
														},
														li({ children }) {
															return <li className="text-[#dcddde]">{children}</li>;
														},
														blockquote({ children }) {
															return (
																<blockquote className="my-2 border-l-4 border-[#00d4aa] pl-4 italic text-[#b9bbbe]">
																	{children}
																</blockquote>
															);
														},
														h1({ children }) {
															return <h1 className="mb-2 text-xl font-bold text-[#ffffff]">{children}</h1>;
														},
														h2({ children }) {
															return <h2 className="mb-2 text-lg font-bold text-[#ffffff]">{children}</h2>;
														},
														h3({ children }) {
															return <h3 className="text-md mb-2 font-bold text-[#ffffff]">{children}</h3>;
														},
														strong({ children }) {
															return <strong className="font-bold text-[#ffffff]">{children}</strong>;
														},
														em({ children }) {
															return <em className="italic text-[#b9bbbe]">{children}</em>;
														},
														a({ href, children }) {
															return (
																<a
																	href={href}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-[#00b0f4] hover:underline"
																>
																	{children}
																</a>
															);
														},
													}}
												>
													{message.content}
												</ReactMarkdown>
											) : (
												<div className="whitespace-pre-wrap">{message.content}</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				))}

				{isLoading && (
					<div className="flex items-start space-x-3">
						<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#00d4aa] md:h-10 md:w-10">
							<Bot className="h-4 w-4 text-white md:h-5 md:w-5" />
						</div>
						<div className="min-w-0 flex-1">
							<div className="mb-1 flex items-center space-x-2">
								<span className="text-sm font-medium text-[#ffffff]">AI Assistant</span>
							</div>
							<div className="flex items-center space-x-2 text-[#8e9297]">
								<div className="flex space-x-1 p-2">
									<div className="typing-dot h-1 w-1 rounded-full bg-[#8e9297]"></div>
									<div className="typing-dot h-1 w-1 rounded-full bg-[#8e9297]"></div>
									<div className="typing-dot h-1 w-1 rounded-full bg-[#8e9297]"></div>
								</div>
							</div>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			<div className="border-t border-[#3c3c3d] p-4">
				<form onSubmit={handleSubmit} className="flex items-end space-x-2">
					<div className="relative flex-1">
						<textarea
							ref={textareaRef}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder={placeholder}
							className="max-h-32 min-h-[44px] w-full resize-none rounded-lg border-none bg-[#40444b] p-3 pr-12 text-sm text-[#dcddde] outline-none"
							rows={1}
							disabled={isLoading}
						/>
						<Button
							type="submit"
							disabled={!input.trim() || isLoading}
							className="absolute bottom-3 right-2 h-8 w-8 bg-[#00d4aa] p-0 text-white hover:bg-[#00c49a]"
						>
							<Send className="h-4 w-4" />
						</Button>
					</div>
				</form>
				<div className="mt-2 text-xs text-[#72767d]">Pressione Enter para enviar, Shift+Enter para nova linha</div>
			</div>
		</div>
	);
}
