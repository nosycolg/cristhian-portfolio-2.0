import { FolderOpen, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";

export function Projects() {
	return (
		<div className="space-y-2">
			{projects.map((project, index) => (
				<div key={index} className="flex items-start space-x-3 rounded p-3 hover:bg-[#32353b] md:p-4">
					<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#43b581] md:h-10 md:w-10">
						<FolderOpen className="h-4 w-4 text-white md:h-5 md:w-5" />
					</div>
					<div className="min-w-0 flex-1">
						<div className="mb-1 flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
							<span className="text-sm font-medium text-[#ffffff]">{project.title}</span>
							<span className="w-fit text-xs text-[#dcddde]">{project.status}</span>
							<span className="text-xs text-[#72767d]">{project.timestamp}</span>
							{project.url && (
								<Button
									variant="ghost"
									size="sm"
									className="h-5 w-5 p-0 text-[#00b0f4] hover:bg-transparent hover:text-[#0099e1]"
								>
									<ExternalLink className="h-3 w-3" />
								</Button>
							)}
						</div>
						<div className="mb-2 text-sm text-[#dcddde]">{project.description}</div>
						<div className="flex flex-wrap gap-1">
							{project.tech.map((tech, techIndex) => (
								<span key={techIndex} className="rounded bg-[#5865f2] px-2 py-1 text-xs font-medium text-white">
									{tech}
								</span>
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
