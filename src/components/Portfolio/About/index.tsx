export function About() {
	return (
		<div className="space-y-2">
			<div className="flex items-start space-x-3 rounded p-3 hover:bg-[#32353b] md:p-4">
				<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#5865f2] md:h-10 md:w-10">
					<span className="text-xs font-bold text-white md:text-sm">
						<img className="h-full w-full rounded-full object-cover" src={"/cristhian-profile.jpeg"} />
					</span>
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
						<span className="text-sm font-medium text-[#ffffff]">Cristhian Felipe</span>
						<span className="w-fit rounded bg-[#5865f2] px-1.5 py-0.5 text-xs text-white">DEV</span>
						<span className="text-xs text-[#72767d]">hoje às 09:30</span>
					</div>
					<div className="text-sm leading-relaxed text-[#dcddde]">
						<p className="mb-2">
							👋 Olá! Sou desenvolvedor full-stack com <strong>2 anos de experiência</strong>, especializado em backend
							com C#/.NET e frontend com React/Next.js.
						</p>
						<p className="mb-2">
							🚀 Tenho experiência sólida em <strong>Azure Cloud</strong>, <strong>AWS</strong> e arquiteturas
							escaláveis. Apaixonado por resolver problemas complexos e entregar soluções de qualidade.
						</p>
						<p>📍 Atualmente em Diadema, SP - Disponível para oportunidades remotas e presenciais.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
