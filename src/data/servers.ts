import { Hash, Calculator, Database, Box, User2Icon, Table, MessageCircle, ImageIcon } from "lucide-react";
import { ReactElement } from "react";

import type { Server } from "../types";

import { ChatMessage } from "@/components/ChatMessage";
import { VirtualAssistant } from "@/components/Projects/VirtualAssistant";
import { About } from "@/components/Portfolio/About";
import { Skills } from "@/components/Portfolio/Skills";
import { CalculatorTool } from "@/components/Tools/Calculator";
import { CsvConverterTool } from "@/components/Tools/CsvConverter";
import { DatabaseTool } from "@/components/Tools/Database";
import { TableCreatorTool } from "@/components/Tools/TableCreator";
import { Projects } from "@/components/Portfolio/Projects";
import { Experiences } from "@/components/Portfolio/Experiences";
import { Contacts } from "@/components/Portfolio/Contacts";

function VirtualAssistantComponent(): ReactElement {
	return VirtualAssistant({
		systemPrompt:
			"Você é um assistente IA útil e amigável. Responda de forma clara, educativa e em português brasileiro. Seja prestativo e mantenha um tom conversacional. Use markdown para formatar suas respostas quando apropriado.",
		placeholder: "Digite sua mensagem aqui...",
		welcomeMessage: `
			**Olá!** Sou seu assistente de IA. 

			Posso ajudar com:
			- **Perguntas gerais** e explicações
			- **Dúvidas sobre tecnologia**
			- **Conceitos** e aprendizado
			- **Ideias** e brainstorming

			*Como posso ajudar você hoje?*
		`,
		chatType: "general-chat",
		channelId: "ai-general-chat",
	});
}

function ImageGalleryComponent(): ReactElement {
	return ChatMessage({
		channelId: "file-images",
		channelName: "Galeria de Imagens",
		channelIcon: ImageIcon,
		placeholder: "",
		welcomeMessage: `
				**Bem-vindo à Galeria de Imagens!**
				Este é seu espaço para compartilhar imagens com preview antes de enviar.

				**Como usar:**
				- **Clique em 'Selecionar Imagem'** para escolher uma foto
				- **Visualize o preview** antes de confirmar
				- **Confirme o envio** ou cancele se necessário
				- **Clique nas imagens** para visualizar em tela cheia
				- **Tudo é salvo** automaticamente

				*Selecione sua primeira imagem!*
			`,
	});
}

export const servers: Server[] = [
	{
		id: "portfolio",
		name: "Cristhian Felipe",
		icon: User2Icon,
		color: "#5865f2",
		channels: [
			{ id: "sobre", name: "sobre-mim", icon: Hash, component: About },
			{ id: "skills", name: "tecnologias", icon: Hash, component: Skills },
			{ id: "projetos", name: "meus-projetos", icon: Hash, component: Projects },
			{ id: "experiencia", name: "experiência", icon: Hash, component: Experiences },
			{ id: "contato", name: "contato", icon: Hash, component: Contacts },
		],
	},
	{
		id: "projects",
		name: "Projetos",
		icon: Box,
		color: "#43b581",
		channels: [
			{
				id: "general-chat",
				name: "assistente-virtual",
				icon: MessageCircle,
				component: VirtualAssistantComponent,
			},
			{
				id: "converter",
				name: "csv-para-xlsx",
				icon: Calculator,
				component: CsvConverterTool,
			},
			{
				id: "calculator",
				name: "calculadora",
				icon: Hash,
				component: CalculatorTool,
			},
			{
				id: "database-generator",
				name: "gerador-sql",
				icon: Database,
				component: DatabaseTool,
			},
			{
				id: "table-creator",
				name: "criador-tabelas",
				icon: Table,
				component: TableCreatorTool,
			},
			{
				id: "images",
				name: "imagens",
				icon: ImageIcon,
				component: ImageGalleryComponent,
			},
		],
	},
];
