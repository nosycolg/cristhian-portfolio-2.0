import { Download, FileText } from "lucide-react";
import { useState } from "react";

import { DiscordMessage } from "@/components/Discord/Components/DiscordMessage";
import { Button } from "@/components/ui/button";

export function CsvConverterTool() {
	const [csvData, setCsvData] = useState("");
	const [isConverting, setIsConverting] = useState(false);

	const handleConvert = async () => {
		setIsConverting(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsConverting(false);
	};

	return (
		<DiscordMessage
			icon={<FileText className="h-4 w-4 text-white md:h-5 md:w-5" />}
			badgeText="ONLINE"
			badgeColor="#43b581"
			title="CSV para Excel Converter"
			subtitle="ferramenta gratuita"
		>
			🔄 Converta seus arquivos CSV para Excel (.xlsx) de forma rápida e segura.
			<div className="mt-3 space-y-3">
				<textarea
					value={csvData}
					onChange={(e) => setCsvData(e.target.value)}
					placeholder="Cole seus dados CSV aqui..."
					className="h-32 w-full resize-none rounded border-none bg-[#40444b] p-3 text-sm text-[#dcddde] outline-none"
				/>
				<div className="flex gap-2">
					<Button
						onClick={handleConvert}
						disabled={!csvData || isConverting}
						className="bg-[#43b581] text-white hover:bg-[#3ca374]"
					>
						{isConverting ? "Convertendo..." : "Converter para Excel"}
					</Button>
					<Button variant="outline" className="border-[#43b581] text-[#43b581] hover:bg-[#43b581] hover:text-white">
						<Download className="mr-2 h-4 w-4" />
						Download
					</Button>
				</div>
			</div>
		</DiscordMessage>
	);
}
