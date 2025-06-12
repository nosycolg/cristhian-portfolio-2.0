import { Ruler } from "lucide-react";
import { useState } from "react";

import { DiscordMessage } from "@/components/Discord/Components/DiscordMessage";
import { Button } from "@/components/ui/button";

export function UnitConverterTool() {
	const [value, setValue] = useState("");
	const [fromUnit, setFromUnit] = useState("cm");
	const [toUnit, setToUnit] = useState("m");
	const [result, setResult] = useState("");

	const conversionFactors: Record<string, number> = {
		cm: 0.01,
		m: 1,
		km: 1000,
		inch: 0.0254,
		ft: 0.3048,
	};

	const convertUnits = () => {
		const inputValue = parseFloat(value);
		if (!isNaN(inputValue)) {
			const resultValue = (inputValue * conversionFactors[fromUnit]) / conversionFactors[toUnit];
			setResult(resultValue.toFixed(4));
		} else {
			setResult("Insira um valor válido");
		}
	};

	return (
		<DiscordMessage
			icon={<Ruler className="h-4 w-4 text-white md:h-5 md:w-5" />}
			badgeText="ONLINE"
			badgeColor="#43b581"
			title="Conversor de Unidades"
			subtitle="ferramenta gratuita"
		>
			📏 Converta entre diferentes unidades de medida (comprimento).
			<div className="mt-3 space-y-3">
				<input
					type="number"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder="Valor"
					className="w-full rounded border-none bg-[#40444b] p-3 text-sm text-[#dcddde] outline-none"
				/>
				<div className="flex gap-2">
					<select
						value={fromUnit}
						onChange={(e) => setFromUnit(e.target.value)}
						className="rounded border-none bg-[#40444b] p-3 text-sm text-[#dcddde] outline-none"
					>
						<option value="cm">Centímetros (cm)</option>
						<option value="m">Metros (m)</option>
						<option value="km">Quilômetros (km)</option>
						<option value="inch">Polegadas (in)</option>
						<option value="ft">Pés (ft)</option>
					</select>
					<select
						value={toUnit}
						onChange={(e) => setToUnit(e.target.value)}
						className="rounded border-none bg-[#40444b] p-3 text-sm text-[#dcddde] outline-none"
					>
						<option value="cm">Centímetros (cm)</option>
						<option value="m">Metros (m)</option>
						<option value="km">Quilômetros (km)</option>
						<option value="inch">Polegadas (in)</option>
						<option value="ft">Pés (ft)</option>
					</select>
				</div>
				<Button onClick={convertUnits} disabled={!value} className="bg-[#43b581] text-white hover:bg-[#3ca374]">
					Converter
				</Button>
				{result && (
					<div className="text-sm text-[#dcddde]">
						Resultado: {result} {toUnit}
					</div>
				)}
			</div>
		</DiscordMessage>
	);
}
