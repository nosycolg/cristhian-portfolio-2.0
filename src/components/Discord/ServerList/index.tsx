import { ServerItem } from "./ServerItem";
import { ExternalLinkItem } from "./ExternalLinkItem";

import { serverCategories } from "@/data/servers";
import { Server } from "@/types";

type ServerListProps = {
	servers: Server[];
	activeServer: string;
	onServerChange: (serverId: string) => void;
	isExpanded: boolean;
	setIsExpanded: (expanded: boolean) => void;
};

export function ServerList({ activeServer, onServerChange, isExpanded, setIsExpanded }: ServerListProps) {
	const Divider = () => (
		<div className={`${isExpanded ? "w-full" : "w-8"} mr-3 h-0.5 rounded bg-[#36393f] transition-all duration-300`} />
	);

	return (
		<div
			className={`discord-scrollbar hidden flex-col overflow-y-auto bg-[#202225] py-3 transition-all duration-300 ease-in-out md:flex ${
				isExpanded ? "w-60" : "w-[72px]"
			}`}
			onMouseEnter={() => setIsExpanded(true)}
			onMouseLeave={() => setIsExpanded(false)}
		>
			<div className="flex flex-col items-center space-y-2 pl-3">
				{serverCategories.portfolio && (
					<ServerItem
						server={serverCategories.portfolio}
						activeServer={activeServer}
						isExpanded={isExpanded}
						onServerChange={onServerChange}
					/>
				)}

				<Divider />

				<div className="flex w-full flex-col space-y-2">
					{serverCategories.links.map((link) => (
						<ExternalLinkItem
							key={link.id}
							href={link.href}
							icon={link.icon}
							name={link.name}
							subtitle={link.subtitle}
							isExpanded={isExpanded}
						/>
					))}
				</div>

				<Divider />

				{serverCategories.content.map((server) => (
					<ServerItem
						key={server.id}
						server={server}
						activeServer={activeServer}
						isExpanded={isExpanded}
						onServerChange={onServerChange}
					/>
				))}
			</div>
		</div>
	);
}
