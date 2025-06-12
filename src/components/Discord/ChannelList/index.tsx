import { Channel } from "@/types";

export function ChannelList({
	channels,
	activeChannel,
	onChannelChange,
}: {
	channels: Channel[];
	activeChannel: string;
	onChannelChange: (channelId: string) => void;
}) {
	return (
		<div className="discord-scrollbar flex-1 overflow-y-auto p-2">
			<div className="mb-4">
				<div className="flex items-center justify-between px-2 py-1">
					<span className="text-xs font-semibold uppercase tracking-wide text-[#8e9297]">Canais de texto</span>
				</div>
				<div className="space-y-0.5">
					{channels.map((channel) => (
						<button
							key={channel.id}
							onClick={() => onChannelChange(channel.id)}
							className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-sm transition-colors ${
								activeChannel === channel.id
									? "bg-[#393c43] text-[#ffffff]"
									: "text-[#8e9297] hover:bg-[#36393f] hover:text-[#dcddde]"
							}`}
						>
							<channel.icon className="h-4 w-4 flex-shrink-0" />
							<span className="truncate">{channel.name}</span>
							{(channel.id === "posts" || channel.id === "repositories") && (
								<div className="ml-auto h-2 w-2 flex-shrink-0 rounded-full bg-[#43b581]"></div>
							)}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
