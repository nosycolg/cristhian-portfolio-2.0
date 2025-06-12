import { ReactNode } from "react";

interface DiscordMessageProps {
	icon: ReactNode;
	badgeText?: string;
	badgeColor?: string;
	title: string;
	subtitle?: string;
	children: ReactNode;
}

export function DiscordMessage({
	icon,
	badgeText,
	badgeColor = "#5865f2",
	title,
	subtitle,
	children,
}: DiscordMessageProps) {
	return (
		<div className="flex items-start space-x-3 rounded p-3 hover:bg-[#32353b] md:p-4">
			<div
				className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full md:h-10 md:w-10"
				style={{ backgroundColor: badgeColor }}
			>
				{icon}
			</div>
			<div className="min-w-0 flex-1">
				<div className="mb-1 flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
					<span className="text-sm font-medium text-white">{title}</span>
					{badgeText && (
						<span className="w-fit rounded px-1.5 py-0.5 text-xs text-white" style={{ backgroundColor: badgeColor }}>
							{badgeText}
						</span>
					)}
					{subtitle && <span className="text-xs text-[#72767d]">{subtitle}</span>}
				</div>
				<div className="mb-3 text-sm text-[#dcddde]">{children}</div>
			</div>
		</div>
	);
}
