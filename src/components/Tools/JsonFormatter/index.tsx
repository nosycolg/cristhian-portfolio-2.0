import { Braces } from "lucide-react";
import { useState } from "react";

import { DiscordMessage } from "@/components/Discord/Components/DiscordMessage";
import { Button } from "@/components/ui/button";

export function JsonFormatterTool() {
	const [jsonInput, setJsonInput] = useState("");
	const [formattedJson, setFormattedJson] = useState("");
	const [error, setError] = useState("");

	const formatJson = () => {
		try {
			const parsed = JSON.parse(jsonInput);
			setFormattedJson(JSON.stringify(parsed, null, 2));
			setError("");
		} catch {
			setError("JSON inválido. Por favor, verifique a sintaxe.");
			setFormattedJson("");
		}
	};

	return (
		<DiscordMessage
			icon={<Braces className="h-4 w-4 text-white md:h-5 md:w-5" />}
			badgeText="ONLINE"
			badgeColor="#43b581"
			title="Formatador JSON"
			subtitle="ferramenta gratuita"
		>
			📝 Formate e valide seus dados JSON de forma simples e rápida.
			<div className="mt-3 space-y-3">
				<textarea
					value={jsonInput}
					onChange={(e) => setJsonInput(e.target.value)}
					placeholder="Cole seu JSON aqui..."
					className="h-32 w-full resize-none rounded border-none bg-[#40444b] p-3 text-sm text-[#dcddde] outline-none"
				/>
				<Button onClick={formatJson} disabled={!jsonInput} className="bg-[#43b581] text-white hover:bg-[#3ca374]">
					Formatar JSON
				</Button>
				{error && <div className="text-sm text-[#ff5555]">{error}</div>}
				{formattedJson && (
					<pre className="overflow-x-auto rounded bg-[#2f3136] p-3 text-sm text-[#dcddde]">{formattedJson}</pre>
				)}
			</div>
		</DiscordMessage>
	);
}
