import { Calculator } from "lucide-react";
import { useState } from "react";

import { DiscordMessage } from "@/components/Discord/Components/DiscordMessage";
import { Button } from "@/components/ui/button";

export function CalculatorTool() {
	const [result, setResult] = useState("0");
	const [operation, setOperation] = useState("");
	const [currentInput, setCurrentInput] = useState("");

	const handleButtonClick = (value: string) => {
		if (value === "C") {
			setResult("0");
			setOperation("");
			setCurrentInput("");
		} else if (value === "±") {
			setCurrentInput((prev) => (prev.startsWith("-") ? prev.slice(1) : `-${prev}`));
			setResult((prev) => (prev.startsWith("-") ? prev.slice(1) : `-${prev}`));
		} else if (value === "%") {
			setCurrentInput((prev) => `${parseFloat(prev || result) / 100}`);
			setResult((parseFloat(currentInput || result) / 100).toString());
		} else if (["÷", "×", "-", "+"].includes(value)) {
			if (currentInput) {
				setOperation(`${currentInput} ${value}`);
				setCurrentInput("");
			}
		} else if (value === "=") {
			if (currentInput && operation) {
				const [leftOperand, operator] = operation.split(" ");
				const rightOperand = currentInput;
				let calcResult: number;
				switch (operator) {
					case "+":
						calcResult = parseFloat(leftOperand) + parseFloat(rightOperand);
						break;
					case "-":
						calcResult = parseFloat(leftOperand) - parseFloat(rightOperand);
						break;
					case "×":
						calcResult = parseFloat(leftOperand) * parseFloat(rightOperand);
						break;
					case "÷":
						calcResult = parseFloat(leftOperand) / parseFloat(rightOperand);
						break;
					default:
						return;
				}
				setResult(calcResult.toString());
				setOperation("");
				setCurrentInput("");
			}
		} else if (value === ".") {
			if (!currentInput.includes(".")) {
				setCurrentInput((prev) => prev + value);
				setResult((prev) => prev + value);
			}
		} else {
			setCurrentInput((prev) => prev + value);
			setResult((prev) => (prev === "0" ? value : prev + value));
		}
	};

	return (
		<DiscordMessage
			icon={<Calculator className="h-4 w-4 text-white md:h-5 md:w-5" />}
			badgeText="BETA"
			badgeColor="#faa61a"
			title="Calculadora Avançada"
			subtitle="🧮 Para desenvolvedores"
		>
			<div className="rounded bg-[#40444b] p-4">
				<div className="mb-3 rounded bg-[#2f3136] p-3 text-right">
					<div className="text-xs text-[#72767d]">{operation || " "}</div>
					<div className="font-mono text-xl text-[#ffffff]">{result}</div>
				</div>
				<div className="grid grid-cols-4 gap-2">
					{["C", "±", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="].map(
						(btn) => (
							<Button
								key={btn}
								onClick={() => handleButtonClick(btn)}
								variant="outline"
								className="h-12 border-[#40444b] bg-[#36393f] text-[#dcddde] hover:bg-[#40444b]"
							>
								{btn}
							</Button>
						),
					)}
				</div>
			</div>
		</DiscordMessage>
	);
}
