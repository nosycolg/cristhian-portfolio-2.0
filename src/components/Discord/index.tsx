import { Menu, Hash } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "../ui/button";

import { ServerList } from "./ServerList";
import { Sidebar } from "./Sidebar";

import { Server } from "@/types";
import { User } from "@/types/auth";

interface DiscordLayoutProps {
	servers: Server[];
	user: User;
	onLogout: () => void;
}

export default function DiscordLayout({ servers, user, onLogout }: DiscordLayoutProps) {
	const [activeServer, setActiveServer] = useState(servers[0]?.id || "");
	const [activeChannel, setActiveChannel] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isServerListExpanded, setIsServerListExpanded] = useState(false);

	const currentServer = servers.find((s) => s.id === activeServer);
	const currentChannel = currentServer?.channels.find((c) => c.id === activeChannel);

	useEffect(() => {
		if (currentServer && !activeChannel) {
			setActiveChannel(currentServer.channels[0]?.id || "");
		}
	}, [currentServer, activeChannel]);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth >= 768) {
				setSidebarOpen(false);
			}
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const handleServerChange = (serverId: string) => {
		setActiveServer(serverId);
		const newServer = servers.find((s) => s.id === serverId);
		if (newServer) {
			setActiveChannel(newServer.channels[0]?.id || "");
		}
	};

	const handleChannelClick = (channelId: string) => {
		setActiveChannel(channelId);
		if (isMobile) {
			setSidebarOpen(false);
		}
	};

	if (!currentServer) return null;

	const ContentComponent = currentChannel?.component;

	return (
		<div className="mobile-optimized flex h-screen origin-top-left overflow-hidden bg-[#36393f]">
			<ServerList
				servers={servers}
				activeServer={activeServer}
				onServerChange={handleServerChange}
				isExpanded={isServerListExpanded}
				setIsExpanded={setIsServerListExpanded}
			/>
			<Sidebar
				onLogout={onLogout}
				user={user}
				server={currentServer}
				isMobile={isMobile}
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				activeChannel={activeChannel}
				onChannelChange={handleChannelClick}
			/>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex h-12 items-center justify-between border-b border-[#202225] bg-[#36393f] px-4 shadow-sm">
					<div className="flex min-w-0 flex-1 items-center">
						{isMobile && (
							<Button
								variant="ghost"
								size="sm"
								className="mr-2 h-8 w-8 flex-shrink-0 p-0 text-[#b9bbbe] hover:text-[#dcddde] md:hidden"
								onClick={() => setSidebarOpen(true)}
							>
								<Menu className="h-4 w-4" />
							</Button>
						)}
						<Hash className="mr-2 h-5 w-5 flex-shrink-0 text-[#8e9297]" />
						<span className="truncate text-sm font-semibold text-[#ffffff]">{currentChannel?.name}</span>
					</div>
				</div>
				<div className="content-scrollbar flex-1 overflow-y-auto p-2 md:p-4">
					{ContentComponent && <ContentComponent />}
				</div>
			</div>
		</div>
	);
}
