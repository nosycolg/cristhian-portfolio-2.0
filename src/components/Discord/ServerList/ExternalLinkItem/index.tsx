export const ExternalLinkItem = ({
	href,
	icon: Icon,
	name,
	subtitle,
	isExpanded,
}: {
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	name: string;
	subtitle: string;
	isExpanded: boolean;
}) => (
	<div className="group relative flex w-full items-center">
		<a
			className="flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#36393f] transition-colors duration-500 hover:bg-[#5865f2]"
			href={href}
			target="_blank"
			rel="noreferrer"
		>
			<Icon className="h-5 w-5 text-[#dcddde]" />
		</a>
		{isExpanded && (
			<div className="ml-3 min-w-0 flex-1 opacity-0 duration-200 animate-in fade-in">
				<span className="text-sm text-[#dcddde]">{name}</span>
				<span className="block truncate text-xs text-[#8e9297]">{subtitle}</span>
			</div>
		)}
	</div>
);
