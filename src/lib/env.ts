export const AI_CONFIG = {
	GROQ_API_KEY: process.env.NEXT_PUBLIC_GROQ_API_KEY || "",
	GROQ_MODEL: "llama3-8b-8192",

	HF_API_KEY: process.env.NEXT_PUBLIC_HF_API_KEY || "",
	HF_MODEL: "microsoft/DialoGPT-medium",

	OPENROUTER_API_KEY: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "",
	OPENROUTER_MODEL: "meta-llama/llama-3.2-3b-instruct:free",
};

export const getAvailableAIService = () => {
	if (AI_CONFIG.GROQ_API_KEY) return "groq";
	if (AI_CONFIG.HF_API_KEY) return "huggingface";
	if (AI_CONFIG.OPENROUTER_API_KEY) return "openrouter";
	return "fallback";
};
