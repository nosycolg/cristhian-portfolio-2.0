import { Code2 } from "lucide-react";

import { skills } from "@/data/skills";

export function Skills() {
	return (
		<div className="space-y-2">
			{skills.map((skill, index) => (
				<div key={index} className="flex items-start space-x-3 rounded p-3 hover:bg-[#32353b] md:p-4">
					<div
						className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full md:h-10 md:w-10"
						style={{ backgroundColor: skill.color + "20" }}
					>
						<Code2 className="h-4 w-4 md:h-5 md:w-5" style={{ color: skill.color }} />
					</div>
					<div className="min-w-0 flex-1">
						<div className="mb-1 flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
							<span className="text-sm font-medium text-[#ffffff]">{skill.name}</span>
							<span className="w-fit rounded px-1.5 py-0.5 text-xs text-white" style={{ backgroundColor: skill.color }}>
								{skill.level}
							</span>
							<span className="text-xs text-[#72767d]">{skill.years}</span>
						</div>
						<div className="text-sm text-[#dcddde]">
							Experiência de <strong>{skill.years}</strong> com nível <strong>{skill.level.toLowerCase()}</strong>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
