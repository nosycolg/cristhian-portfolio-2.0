import { Mail, Phone, Github, Linkedin } from "lucide-react";

export function Contacts() {
	return (
		<div className="space-y-2">
			<div className="flex items-start space-x-3 rounded p-3 hover:bg-[#32353b] md:p-4">
				<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#5865f2] md:h-10 md:w-10">
					<Mail className="h-4 w-4 text-white md:h-5 md:w-5" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
						<span className="text-sm font-medium text-[#ffffff]">Email</span>
						<span className="w-fit rounded bg-[#43b581] px-1.5 py-0.5 text-xs text-white">ATIVO</span>
					</div>
					<div className="cursor-pointer break-all text-sm text-[#00b0f4] hover:underline">
						cristhianfelipeyt@gmail.com
					</div>
				</div>
			</div>
			<div className="flex items-start space-x-3 rounded p-3 hover:bg-[#32353b] md:p-4">
				<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#43b581] md:h-10 md:w-10">
					<Phone className="h-4 w-4 text-white md:h-5 md:w-5" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
						<span className="text-sm font-medium text-[#ffffff]">WhatsApp</span>
						<span className="w-fit rounded bg-[#43b581] px-1.5 py-0.5 text-xs text-white">ONLINE</span>
					</div>
					<div className="cursor-pointer text-sm text-[#43b581] hover:underline">+55 81 98626-8533</div>
				</div>
			</div>
			<div className="flex items-start space-x-3 rounded p-3 hover:bg-[#32353b] md:p-4">
				<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#333] md:h-10 md:w-10">
					<Github className="h-4 w-4 text-white md:h-5 md:w-5" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
						<span className="text-sm font-medium text-[#ffffff]">GitHub</span>
						<span className="w-fit rounded bg-[#333] px-1.5 py-0.5 text-xs text-white">PUBLIC</span>
					</div>
					<div className="cursor-pointer break-all text-sm text-[#00b0f4] hover:underline">github.com/nosycolg</div>
				</div>
			</div>
			<div className="flex items-start space-x-3 rounded p-3 hover:bg-[#32353b] md:p-4">
				<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0077b5] md:h-10 md:w-10">
					<Linkedin className="h-4 w-4 text-white md:h-5 md:w-5" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
						<span className="text-sm font-medium text-[#ffffff]">LinkedIn</span>
						<span className="w-fit rounded bg-[#0077b5] px-1.5 py-0.5 text-xs text-white">PROFISSIONAL</span>
					</div>
					<div className="cursor-pointer break-all text-sm text-[#00b0f4] hover:underline">
						linkedin.com/in/cristhian-dev
					</div>
				</div>
			</div>
		</div>
	);
}
