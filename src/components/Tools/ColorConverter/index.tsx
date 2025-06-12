import { Palette } from "lucide-react";
import { useState } from "react";

import { DiscordMessage } from "@/components/Discord/Components/DiscordMessage";

export function ColorConverterTool() {
	const [hex, setHex] = useState("#ffffff");
	const [rgb, setRgb] = useState("rgb(255, 255, 255)");
	const [hsl, setHsl] = useState("hsl(0, 0%, 100%)");

	const hexToRgb = (hex: string) => {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgb(${r}, ${g}, ${b})`;
	};

	const rgbToHsl = (r: number, g: number, b: number) => {
		r /= 255;
		g /= 255;
		b /= 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0,
			s = 0,
			// eslint-disable-next-line prefer-const
			l = (max + min) / 2;

		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}
		return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
	};

	const handleHexChange = (value: string) => {
		if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
			setHex(value);
			const rgbValue = hexToRgb(value);
			setRgb(rgbValue);
			const [r, g, b] = rgbValue.match(/\d+/g)!.map(Number);
			setHsl(rgbToHsl(r, g, b));
		}
	};

	return (
		<DiscordMessage
			icon={<Palette className="h-4 w-4 text-white md:h-5 md:w-5" />}
			badgeText="ONLINE"
			badgeColor="#43b581"
			title="Conversor de Cores"
			subtitle="ferramenta gratuita"
		>
			🎨 Converta cores entre HEX, RGB e HSL.
			<div className="mt-3 space-y-3">
				<div className="flex items-center gap-2">
					<input
						type="text"
						value={hex}
						onChange={(e) => {
							setHex(e.target.value);
							handleHexChange(e.target.value);
						}}
						placeholder="#FFFFFF"
						className="w-full rounded border-none bg-[#40444b] p-3 text-sm text-[#dcddde] outline-none"
					/>
					<div className="h-12 w-12 rounded" style={{ backgroundColor: hex }}></div>
				</div>
				<div className="text-sm text-[#dcddde]">RGB: {rgb}</div>
				<div className="text-sm text-[#dcddde]">HSL: {hsl}</div>
			</div>
		</DiscordMessage>
	);
}
