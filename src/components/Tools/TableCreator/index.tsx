import { Code, Database, Download, Edit3, FileSpreadsheet, Grid3X3, Plus, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

import { DiscordMessage } from "@/components/Discord/Components/DiscordMessage";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Column {
	id: string;
	name: string;
	type: "text" | "number" | "date" | "email";
}

type Row = Record<string, string>;

export function TableCreatorTool() {
	const [columns, setColumns] = useState<Column[]>([
		{ id: "col_1", name: "Nome", type: "text" },
		{ id: "col_2", name: "Email", type: "text" },
	]);
	const [rows, setRows] = useState<Row[]>([
		{ col_1: "João Silva", col_2: "joao@email.com" },
		{ col_2: "maria@email.com", col_1: "Maria Santos" },
	]);
	const [tableName, setTableName] = useState<string>("Minha Tabela");
	const [isEditing, setIsEditing] = useState<boolean>(false);

	const addColumn = () => {
		const newId = `col_${Date.now()}`;
		setColumns([...columns, { id: newId, name: `Coluna ${columns.length + 1}`, type: "text" }]);
		setRows(rows.map((row) => ({ ...row, [newId]: "" })));
	};

	const updateColumn = (index: number, field: keyof Column, value: string) => {
		const newColumns = [...columns];
		newColumns[index][field] = value as unknown as never;
		setColumns(newColumns);
	};

	const removeColumn = (index: number) => {
		if (columns.length <= 1) return;
		const columnId = columns[index].id;
		setColumns(columns.filter((_, i) => i !== index));
		setRows(
			rows.map((row) => {
				const newRow = { ...row };
				delete newRow[columnId];
				return newRow;
			}),
		);
	};

	const addRow = () => {
		const newRow: Row = columns.reduce((acc, col) => ({ ...acc, [col.id]: "" }), {});
		setRows([...rows, newRow]);
	};

	const removeRow = (index: number) => {
		if (rows.length <= 1) return;
		setRows(rows.filter((_, i) => i !== index));
	};

	const updateRow = (rowIndex: number, colId: string, value: string) => {
		const newRows = [...rows];
		newRows[rowIndex][colId] = value;
		setRows(newRows);
	};

	const exportToCSV = () => {
		const headers = columns.map((col) => col.name).join(",");
		const csvRows = rows.map((row) => columns.map((col) => `"${row[col.id] || ""}"`).join(","));
		const csvContent = [headers, ...csvRows].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${tableName.replace(/\s+/g, "_")}.csv`;
		link.click();
	};

	const exportToExcel = () => {
		const wsData = [columns.map((col) => col.name), ...rows.map((row) => columns.map((col) => row[col.id] || ""))];
		const ws = XLSX.utils.aoa_to_sheet(wsData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Dados");
		XLSX.writeFile(wb, `${tableName.replace(/\s+/g, "_")}.xlsx`);
	};

	const exportToJSON = () => {
		const jsonRows = rows.map((row) =>
			columns.reduce(
				(obj, col) => {
					obj[col.name] = row[col.id] || "";
					return obj;
				},
				{} as Record<string, string>,
			),
		);
		const jsonContent = JSON.stringify({ tableName, data: jsonRows }, null, 2);
		const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${tableName.replace(/\s+/g, "_")}.json`;
		link.click();
	};

	return (
		<DiscordMessage
			icon={<Grid3X3 className="h-5 w-5 text-white" />}
			badgeText="ONLINE"
			badgeColor="#43b581"
			title="Criador de Tabelas Pro"
			subtitle="ferramenta avançada"
		>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{isEditing ? (
							<input
								type="text"
								value={tableName}
								onChange={(e) => setTableName(e.target.value)}
								onBlur={() => setIsEditing(false)}
								onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
								className="rounded border-none bg-[#40444b] px-2 py-1 text-lg font-semibold text-[#ffffff] outline-none"
								autoFocus
							/>
						) : (
							<h3
								className="cursor-pointer text-lg font-semibold text-[#ffffff] transition-colors hover:text-[#43b581]"
								onClick={() => setIsEditing(true)}
							>
								📊 {tableName}
							</h3>
						)}
						<Button
							onClick={() => setIsEditing(!isEditing)}
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0 text-[#72767d] hover:text-[#dcddde]"
						>
							<Edit3 className="h-3 w-3" />
						</Button>
					</div>
				</div>

				<Card className="border-[#40444b] bg-[#2f3136]">
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-sm text-[#dcddde]">
							<Settings className="h-4 w-4" />
							Configurar Colunas
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{columns.map((col, index) => (
							<div key={col.id} className="flex items-center gap-2 rounded bg-[#40444b] p-2">
								<div className="grid flex-1 grid-cols-2 gap-2">
									<input
										type="text"
										value={col.name}
										onChange={(e) => updateColumn(index, "name", e.target.value)}
										placeholder="Nome da coluna"
										className="rounded border-none bg-[#36393f] px-2 py-1 text-sm text-[#dcddde] outline-none"
									/>
									<select
										value={col.type}
										onChange={(e) => updateColumn(index, "type", e.target.value)}
										className="rounded border-none bg-[#36393f] px-2 py-1 text-sm text-[#dcddde] outline-none"
									>
										<option value="text">📝 Texto</option>
										<option value="number">🔢 Número</option>
										<option value="date">📅 Data</option>
										<option value="email">📧 Email</option>
									</select>
								</div>
								<Button
									onClick={() => removeColumn(index)}
									disabled={columns.length <= 1}
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 text-[#ff5555] hover:bg-[#ff5555]/10 hover:text-[#ff3333]"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
						<Button onClick={addColumn} className="w-full bg-[#43b581] text-white hover:bg-[#3ca374]">
							<Plus className="mr-2 h-4 w-4" />
							Nova Coluna
						</Button>
					</CardContent>
				</Card>

				<Card className="border-[#40444b] bg-[#2f3136]">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2 text-sm text-[#dcddde]">
								<Database className="h-4 w-4" />
								Dados da Tabela
							</CardTitle>
							<Button onClick={addRow} size="sm" className="bg-[#43b581] text-white hover:bg-[#3ca374]">
								<Plus className="mr-1 h-4 w-4" />
								Linha
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-[#40444b]">
										{columns.map((col) => (
											<th key={col.id} className="p-2 text-left text-sm font-medium text-[#dcddde]">
												{col.name}
											</th>
										))}
										<th className="w-12"></th>
									</tr>
								</thead>
								<tbody>
									{rows.map((row, rowIndex) => (
										<tr key={rowIndex} className="border-b border-[#40444b]/50 hover:bg-[#40444b]/30">
											{columns.map((col) => (
												<td key={col.id} className="p-2">
													<input
														type={
															col.type === "number"
																? "number"
																: col.type === "date"
																	? "date"
																	: col.type === "email"
																		? "email"
																		: "text"
														}
														value={row[col.id] || ""}
														onChange={(e) => updateRow(rowIndex, col.id, e.target.value)}
														className="w-full rounded border-none bg-[#36393f] px-2 py-1 text-sm text-[#dcddde] outline-none focus:bg-[#40444b]"
														placeholder={
															col.type === "email"
																? "email@exemplo.com"
																: col.type === "date"
																	? "dd/mm/aaaa"
																	: "Digite aqui..."
														}
													/>
												</td>
											))}
											<td className="p-2">
												<Button
													onClick={() => removeRow(rowIndex)}
													disabled={rows.length <= 1}
													variant="ghost"
													size="sm"
													className="h-6 w-6 p-0 text-[#ff5555] hover:bg-[#ff5555]/10 hover:text-[#ff3333]"
												>
													<Trash2 className="h-3 w-3" />
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-2">
					<Separator className="bg-[#40444b]" />
					<div className="flex flex-wrap gap-2">
						<Button
							onClick={exportToCSV}
							disabled={rows.length === 0}
							className="min-w-[120px] flex-1 bg-[#43b581] text-white hover:bg-[#3ca374]"
						>
							<FileSpreadsheet className="mr-2 h-4 w-4" />
							CSV
						</Button>
						<Button
							onClick={exportToExcel}
							disabled={rows.length === 0}
							className="min-w-[120px] flex-1 bg-[#5865f2] text-white hover:bg-[#4752c4]"
						>
							<Download className="mr-2 h-4 w-4" />
							Excel
						</Button>
						<Button
							onClick={exportToJSON}
							disabled={rows.length === 0}
							className="min-w-[120px] flex-1 bg-[#faa61a] text-white hover:bg-[#e8941a]"
						>
							<Code className="mr-2 h-4 w-4" />
							JSON
						</Button>
					</div>
				</div>

				<div className="rounded border-l-2 border-[#43b581] bg-[#2f3136] p-2 text-xs text-[#72767d]">
					💡 <strong>Dica:</strong> Clique no título para editá-lo. Use Tab para navegar entre os campos rapidamente.
				</div>
			</div>
		</DiscordMessage>
	);
}
