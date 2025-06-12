import { Github, Linkedin, FileJson } from "lucide-react";

import { Server } from "@/types";

export function ServerList({
	servers,
	activeServer,
	onServerChange,
	isExpanded,
	setIsExpanded,
}: {
	servers: Server[];
	activeServer: string;
	onServerChange: (serverId: string) => void;
	isExpanded: boolean;
	setIsExpanded: (expanded: boolean) => void;
}) {
	const portfolioServer = servers.find((s) => s.id === "portfolio");
	const otherServers = servers.filter((s) => s.id === "projects");

	return (
		<div
			className={`discord-scrollbar hidden flex-col overflow-y-auto bg-[#202225] py-3 transition-all duration-300 ease-in-out md:flex ${
				isExpanded ? "w-60" : "w-[72px]"
			}`}
			onMouseEnter={() => setIsExpanded(true)}
			onMouseLeave={() => setIsExpanded(false)}
		>
			<div className="flex flex-col items-center space-y-2 pl-3">
				{portfolioServer && (
					<div
						onClick={() => onServerChange(portfolioServer.id)}
						className={`group relative flex w-full items-center justify-start py-2 ${
							activeServer === portfolioServer.id ? "rounded-2xl" : "rounded-full"
						} cursor-pointer transition-all duration-200 hover:rounded-xl`}
					>
						<div
							className={`h-12 w-12 bg-[#36393f] hover:bg-[#5865f2] ${
								activeServer === portfolioServer.id ? "bg-[#5865f2]" : ""
							} flex cursor-pointer items-center justify-center rounded-2xl transition-all duration-200 hover:rounded-xl`}
						>
							<img
								className="h-full w-full rounded-2xl object-cover transition-all duration-200 hover:rounded-xl"
								src={"/cristhian-profile.jpeg"}
							/>
						</div>
						{isExpanded && (
							<div className="ml-3 min-w-0 flex-1 opacity-0 duration-200 animate-in fade-in">
								<span className="block truncate text-sm font-medium text-[#ffffff]">{portfolioServer.name}</span>
								<span className="block truncate text-xs text-[#8e9297]">Desenvolvedor</span>
							</div>
						)}
					</div>
				)}

				<div
					className={`${isExpanded ? "w-full" : "w-8"} mr-3 h-0.5 rounded bg-[#36393f] transition-all duration-300`}
				></div>

				<div className="flex w-full flex-col space-y-2">
					<div className="group relative flex w-full items-center">
						<a
							className="flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#36393f] transition-colors duration-500 hover:bg-[#5865f2]"
							href="https://github.com/nosycolg"
							target="_blank"
							rel="noreferrer"
						>
							<Github className="s h-5 w-5 text-[#dcddde]" />
						</a>
						{isExpanded && (
							<div className="ml-3 min-w-0 flex-1 opacity-0 duration-200 animate-in fade-in">
								<span className="text-sm text-[#dcddde]">GitHub</span>
								<span className="block text-xs text-[#8e9297]">@nosycolg</span>
							</div>
						)}
					</div>

					<div className="group relative flex w-full items-center">
						<a
							className="flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#36393f] transition-colors duration-500 hover:bg-[#5865f2]"
							href="https://www.linkedin.com/in/cristhian-dev/"
							target="_blank"
							rel="noreferrer"
						>
							<Linkedin className="h-5 w-5 text-[#dcddde]" />
						</a>
						{isExpanded && (
							<div className="ml-3 min-w-0 flex-1 opacity-0 duration-200 animate-in fade-in">
								<span className="text-sm text-[#dcddde]">LinkedIn</span>
								<span className="block text-xs text-[#8e9297]">Profissional</span>
							</div>
						)}
					</div>

					<div className="group relative flex w-full items-center">
						<a
							className="flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#36393f] transition-colors duration-500 hover:bg-[#5865f2]"
							href="https://github.com/nosycolg"
							target="_blank"
							rel="noreferrer"
						>
							<FileJson className="h-5 w-5 text-[#dcddde]" />
						</a>
						{isExpanded && (
							<div className="ml-3 min-w-0 flex-1 opacity-0 duration-200 animate-in fade-in">
								<span className="text-sm text-[#dcddde]">Currículo</span>
								<span className="block truncate text-xs text-[#8e9297]">Fazer download</span>
							</div>
						)}
					</div>
				</div>

				<div
					className={`${isExpanded ? "w-full" : "w-8"} mr-3 h-0.5 rounded bg-[#36393f] transition-all duration-300`}
				></div>

				{otherServers.map((server) => (
					<div
						key={server.id}
						onClick={() => onServerChange(server.id)}
						className={`group relative flex w-full items-center ${
							activeServer === server.id ? "rounded-2xl" : "rounded-full"
						} cursor-pointer transition-all duration-200 hover:rounded-xl`}
					>
						<div
							className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#36393f] hover:bg-[#5865f2] ${
								activeServer === server.id ? "bg-[#5865f2]" : ""
							} cursor-pointer transition-colors duration-500`}
						>
							<span className="text-xs font-bold text-white">{<server.icon />}</span>
						</div>
						{isExpanded && (
							<div className="ml-3 min-w-0 flex-1 opacity-0 duration-200 animate-in fade-in">
								<span className="block truncate text-sm text-[#dcddde]">{server.name}</span>
								<span className="block truncate text-xs text-[#8e9297]">{server.channels.length} canais</span>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
