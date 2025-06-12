import { Briefcase } from "lucide-react";

import { experience } from "@/data/experiences";

export function Experiences() {
	return (
		<div className="space-y-2">
			{experience.map((exp, index) => (
				<div key={index} className="flex items-start space-x-3 rounded p-3 hover:bg-[#32353b] md:p-4">
					<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#faa61a] md:h-10 md:w-10">
						<Briefcase className="h-4 w-4 text-white md:h-5 md:w-5" />
					</div>
					<div className="min-w-0 flex-1">
						<div className="mb-1 flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
							<span className="text-sm font-medium text-[#ffffff]">{exp.role}</span>
							<span className="w-fit rounded bg-[#faa61a] px-1.5 py-0.5 text-xs font-medium text-white">
								{exp.company}
							</span>
							<span className="text-xs text-[#72767d]">{exp.period}</span>
						</div>
						<div className="mb-2 text-sm text-[#dcddde]">
							📍 {exp.location}
							<br />
							{exp.description}
						</div>
						<div className="flex flex-wrap gap-1">
							{exp.achievements.map((achievement, achIndex) => (
								<span key={achIndex} className="rounded bg-[#43b581] px-2 py-1 text-xs font-medium text-white">
									{achievement}
								</span>
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
