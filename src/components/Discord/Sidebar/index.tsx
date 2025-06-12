import { X } from "lucide-react";

import { ChannelList } from "../ChannelList";

import { User } from "@/types/auth";
import { Server } from "@/types";
import { Button } from "@/components/ui/button";
import UserArea from "@/components/Discord/UserArea";

export function Sidebar({
	onLogout,
	user,
	server,
	isMobile,
	sidebarOpen,
	setSidebarOpen,
	activeChannel,
	onChannelChange,
}: {
	onLogout: () => void;
	user: User;
	server: Server;
	isMobile: boolean;
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
	activeChannel: string;
	onChannelChange: (channelId: string) => void;
}) {
	return (
		<>
			{sidebarOpen && isMobile && (
				<div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
			)}
			<div
				className={`${
					isMobile
						? `fixed left-0 top-0 z-50 h-full transform transition-transform duration-300 ${
								sidebarOpen ? "translate-x-0" : "-translate-x-full"
							}`
						: "relative"
				} flex w-60 flex-col bg-[#2f3136]`}
			>
				<div className="flex h-12 items-center justify-between border-b border-[#202225] px-4 shadow-sm">
					<h1 className="flex-1 truncate text-sm font-semibold text-[#ffffff]">{server.name}</h1>
					{isMobile && (
						<Button
							variant="ghost"
							size="sm"
							className="ml-2 h-8 w-8 flex-shrink-0 p-0 text-[#b9bbbe] hover:text-[#dcddde] md:hidden"
							onClick={() => setSidebarOpen(false)}
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
				<ChannelList channels={server.channels} activeChannel={activeChannel} onChannelChange={onChannelChange} />
				<UserArea user={user} onLogout={onLogout} />
			</div>
		</>
	);
}
