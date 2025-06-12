import { Server } from "@/types";

export const ServerItem = ({
	server,
	onServerChange,
	isExpanded,
	activeServer,
}: {
	server: Server;
	onServerChange: (id: string) => void;
	isExpanded: boolean;
	activeServer: string;
}) => (
	<div
		onClick={() => onServerChange(server.id)}
		className={`group relative flex w-full items-center ${
			activeServer === server.id ? "rounded-2xl" : "rounded-full"
		} cursor-pointer transition-all duration-200 hover:rounded-xl`}
	>
		<div
			className={`flex h-12 w-12 items-center justify-center ${
				server.id === "portfolio" ? "rounded-2xl" : "rounded-full"
			} bg-[#36393f] hover:bg-[#5865f2] ${
				activeServer === server.id ? "bg-[#5865f2]" : ""
			} cursor-pointer transition-colors duration-500`}
		>
			{server.id === "portfolio" ? (
				<img
					className="h-full w-full rounded-2xl object-cover transition-all duration-200 hover:rounded-xl"
					src="/cristhian-profile.jpeg"
				/>
			) : (
				<span className="text-xs font-bold text-white">
					<server.icon className="h-5 w-5" />
				</span>
			)}
		</div>
		{isExpanded && (
			<div className="ml-3 min-w-0 flex-1 opacity-0 duration-200 animate-in fade-in">
				<span className="block truncate text-sm text-[#dcddde]">{server.name}</span>
				<span className="block truncate text-xs text-[#8e9297]">
					{server.id === "portfolio" ? "Desenvolvedor" : `${server.channels.length} canais`}
				</span>
			</div>
		)}
	</div>
);
