export function generateContextualResponse(userInput: string, chatType: string): string {
	const input = userInput.toLowerCase();

	const responses = {
		general: {
			greeting: [
				"**Olá!** Como posso ajudar você hoje?\n\n*Estou aqui para responder suas perguntas sobre qualquer assunto.*",
				"**Oi!** Estou aqui para responder suas perguntas.\n\n**Posso ajudar com:**\n- Explicações gerais\n- Dúvidas técnicas\n- Informações diversas",
				"**Olá!** Em que posso ser útil?\n\n> *Dica: Posso explicar conceitos, ajudar com problemas ou simplesmente conversar!*",
			],
			programming: [
				"**Sobre programação**, posso ajudar com:\n\n- 🐛 **Debugging** e correção de erros\n- 📚 **Conceitos** e explicações\n- ⚡ **Boas práticas** de desenvolvimento\n\nQual sua dúvida específica?",
				"**Desenvolvimento é minha área!** \n\nPode compartilhar:\n- Código que precisa de ajuda\n- Conceitos que quer entender\n- Problemas que está enfrentando",
			],
			default: [
				"**Interessante pergunta!** \n\nBaseado no que você disse, sugiro explorarmos esse tópico mais a fundo.\n\n*Como posso ajudar especificamente?*",
				"**Entendo sua questão.** \n\nVou fazer o meu melhor para ajudar com informações úteis e claras.\n\n**Precisa de mais detalhes sobre algum aspecto específico?**",
				"**Boa pergunta!** \n\nDeixe-me organizar uma resposta clara para você.\n\n> *Sinta-se à vontade para fazer perguntas de acompanhamento!*",
			],
		},
		code: {
			javascript: [
				"**JavaScript é uma linguagem versátil!** \n\nPara seu caso, recomendo:\n\n```javascript\n// Use const/let ao invés de var\nconst minhaVariavel = 'valor';\n\n// Arrow functions para melhor legibilidade\nconst minhaFuncao = () => {\n  // seu código aqui\n};\n```\n\n**Dicas importantes:**\n- Sempre valide dados de entrada\n- Use `try/catch` para tratamento de erros",
				"**Em JavaScript**, considere estas **boas práticas**:\n\n1. **Tipagem**: Use TypeScript quando possível\n2. **Async/Await**: Para operações assíncronas\n3. **Destructuring**: Para código mais limpo\n\n```javascript\n// Exemplo de destructuring\nconst { nome, idade } = usuario;\n```",
			],
			react: [
				"**No React**, lembre-se de:\n\n**Hooks essenciais:**\n- `useState` para estado local\n- `useEffect` para efeitos colaterais\n- `useCallback` para otimização\n\n```jsx\nconst MeuComponente = () => {\n  const [estado, setEstado] = useState(valorInicial);\n  \n  return <div>{estado}</div>;\n};\n```\n\n**Dica:** Mantenha componentes pequenos e reutilizáveis!",
				"**Para React**, considere:\n\n**TypeScript** para melhor tipagem:\n```tsx\ninterface Props {\n  titulo: string;\n  ativo: boolean;\n}\n\nconst Componente: React.FC<Props> = ({ titulo, ativo }) => {\n  return <h1>{titulo}</h1>;\n};\n```\n\n**Evita bugs em produção!**",
			],
			default: [
				"**Para esse problema de código**, sugiro:\n\n1. ✅ **Verificar a sintaxe**\n2. 🧪 **Testar com dados simples**\n3. 🐛 **Usar `console.log` para debug**\n\n```javascript\nconsole.log('Debug:', minhaVariavel);\n```\n\n**Precisa de ajuda específica com algum erro?**",
				'**Boas práticas incluem:**\n\n- 🧹 **Código limpo** e legível\n- 📝 **Comentários úteis** (não óbvios)\n- 🧪 **Testes unitários**\n- 📚 **Versionamento com Git**\n\n> *"Código é escrito uma vez, mas lido muitas vezes"*',
			],
		},
		creative: {
			story: [
				"**Para uma boa história**, considere:\n\n**Elementos essenciais:**\n- 🎭 **Protagonista interessante** com motivações claras\n- ⚔️ **Conflito envolvente** que gere tensão\n- 🎯 **Arco narrativo** com início, meio e fim\n\n**Estrutura básica:**\n1. **Setup** - Apresente o mundo e personagens\n2. **Confronto** - Desenvolva o conflito\n3. **Resolução** - Conclua de forma satisfatória",
				"**Elementos para uma narrativa envolvente:**\n\n**Personagens:**\n- Motivações claras\n- Falhas humanas\n- Crescimento ao longo da história\n\n**Cenário:**\n- Detalhes sensoriais\n- Atmosfera adequada ao tom\n\n**Diálogos:**\n- Naturais e únicos para cada personagem\n- Revelam personalidade e avançam a trama",
			],
			writing: [
				"**Na escrita criativa**, use os **cinco sentidos**:\n\n- 👁️ **Visão**: Cores, formas, movimento\n- 👂 **Audição**: Sons, música, silêncio\n- 👃 **Olfato**: Aromas que evocam memórias\n- 👅 **Paladar**: Sabores que caracterizam momentos\n- ✋ **Tato**: Texturas, temperatura, sensações\n\n> **Regra de ouro:** *Mostre, não apenas conte*",
				"**Dicas de escrita:**\n\n**Para melhorar:**\n1. 📚 **Leia muito** - diferentes gêneros e estilos\n2. ✍️ **Escreva regularmente** - pratique diariamente\n3. 👥 **Aceite feedback** - críticas construtivas\n4. 🔄 **Revise sempre** - primeira versão nunca é a final\n\n**Lembre-se:** *Todo escritor foi iniciante um dia!*",
			],
			default: [
				"**Criatividade flui melhor sem pressão!** \n\nQue tal começarmos com um **brainstorming livre**?\n\n**Técnicas úteis:**\n- 🧠 **Mind mapping**\n- 📝 **Escrita livre por 10 minutos**\n- 🎲 **Palavras aleatórias como inspiração**\n\n*Qual direção te inspira mais?*",
				"**Para projetos criativos**, recomendo:\n\n**Processo criativo:**\n1. 🎯 **Definir objetivo** - O que quer transmitir?\n2. 🔍 **Pesquisar referências** - Inspire-se em outros trabalhos\n3. ✏️ **Esboçar ideias** - Não se preocupe com perfeição\n4. 🔄 **Iterar e refinar** - Melhore gradualmente\n\n**Qual etapa precisa de mais ajuda?**",
			],
		},
	};

	let category = "general";
	let subcategory = "default";

	if (chatType === "code-assistant") {
		category = "code";
		if (input.includes("javascript") || input.includes("js")) subcategory = "javascript";
		else if (input.includes("react")) subcategory = "react";
	} else if (chatType === "creative-writing") {
		category = "creative";
		if (input.includes("história") || input.includes("story")) subcategory = "story";
		else if (input.includes("escrit") || input.includes("text")) subcategory = "writing";
	} else {
		if (input.includes("olá") || input.includes("oi") || input.includes("hello")) subcategory = "greeting";
		else if (input.includes("programação") || input.includes("código") || input.includes("code"))
			subcategory = "programming";
	}

	const categoryResponses = responses[category as keyof typeof responses];
	const subcategoryResponses = categoryResponses[subcategory as keyof typeof categoryResponses];
	const randomResponse = subcategoryResponses[Math.floor(Math.random() * subcategoryResponses.length)];

	return `${randomResponse}\n\n---\n\n💡 **Nota:** *Esta é uma resposta de fallback. Para respostas mais avançadas, configure uma chave de API gratuita do Groq ou Hugging Face.*`;
}

export async function getAIResponse(userInput: string, systemPrompt: string, chatType: string): Promise<string> {
	try {
		const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY || "gsk_demo_key"}`,
			},
			body: JSON.stringify({
				model: "llama3-8b-8192",
				messages: [
					{
						role: "system",
						content: `${systemPrompt}\n\nIMPORTANTE: Responda sempre em português brasileiro e use markdown para formatar sua resposta quando apropriado. Use **negrito**, *itálico*, \`código\`, listas, etc.`,
					},
					{
						role: "user",
						content: userInput,
					},
				],
				max_tokens: 1000,
				temperature: 0.7,
				stream: false,
			}),
		});

		if (!response.ok) {
			throw new Error(`Erro na API: ${response.status}`);
		}

		const data = await response.json();
		return data.choices[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";
	} catch (error) {
		console.error("Erro ao chamar Groq API:", error);

		try {
			const hfResponse = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_API_KEY || "hf_demo"}`,
				},
				body: JSON.stringify({
					inputs: `${systemPrompt}\n\nUsuário: ${userInput}\nAssistente:`,
					parameters: {
						max_length: 500,
						temperature: 0.7,
						do_sample: true,
					},
				}),
			});

			if (hfResponse.ok) {
				const hfData = await hfResponse.json();
				return hfData[0]?.generated_text?.split("Assistente:")[1]?.trim() || "Resposta gerada com sucesso!";
			}
		} catch (hfError) {
			console.error("Erro no fallback Hugging Face:", hfError);
		}

		return generateContextualResponse(userInput, chatType);
	}
}
