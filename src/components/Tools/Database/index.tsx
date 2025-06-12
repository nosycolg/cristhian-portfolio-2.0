import { Database } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function DatabaseTool() {
	const [tableName, setTableName] = useState("");
	const [columns, setColumns] = useState("");
	const [generatedSQL, setGeneratedSQL] = useState("");

	const generateSQL = () => {
		if (tableName && columns) {
			const sql = `CREATE TABLE ${tableName} (\n  ${columns
				.split(",")
				.map((col) => `${col.trim()} VARCHAR(255)`)
				.join(",\n  ")}\n);`;
			setGeneratedSQL(sql);
		}
	};

	return (
		<div className="space-y-2">
			<div className="flex items-start space-x-3 rounded p-3 hover:bg-[#32353b] md:p-4">
				<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#5865f2] md:h-10 md:w-10">
					<Database className="h-4 w-4 text-white md:h-5 md:w-5" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
						<span className="text-sm font-medium text-[#ffffff]">Gerador SQL</span>
						<span className="w-fit rounded bg-[#5865f2] px-1.5 py-0.5 text-xs text-white">PRO</span>
					</div>
					<div className="mb-3 text-sm text-[#dcddde]">
						🗄️ Gere comandos SQL automaticamente para criar tabelas e queries.
					</div>
					<div className="space-y-3">
						<input
							type="text"
							value={tableName}
							onChange={(e) => setTableName(e.target.value)}
							placeholder="Nome da tabela"
							className="w-full rounded border-none bg-[#40444b] p-3 text-sm text-[#dcddde] outline-none"
						/>
						<input
							type="text"
							value={columns}
							onChange={(e) => setColumns(e.target.value)}
							placeholder="Colunas (separadas por vírgula)"
							className="w-full rounded border-none bg-[#40444b] p-3 text-sm text-[#dcddde] outline-none"
						/>
						<Button onClick={generateSQL} className="bg-[#5865f2] text-white hover:bg-[#4752c4]">
							Gerar SQL
						</Button>
						{generatedSQL && (
							<pre className="overflow-x-auto rounded bg-[#2f3136] p-3 text-sm text-[#dcddde]">{generatedSQL}</pre>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
