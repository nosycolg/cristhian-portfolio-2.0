import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";
import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";

export default tseslint.config({
	files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
	languageOptions: {
		globals: globals.browser,
		parserOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
		},
	},
	plugins: {
		react: pluginReact,
		prettier: pluginPrettier,
		import: importPlugin,
		"@next/next": nextPlugin,
	},
	extends: [
		js.configs.recommended,
		...tseslint.configs.recommended,
		pluginReact.configs.flat.recommended,
		configPrettier,
		{
			rules: {
				...nextPlugin.configs["core-web-vitals"].rules,
			},
		},
	],
	settings: {
		react: {
			version: "18.2",
		},
	},
	rules: {
		"prettier/prettier": "error",
		"react/react-in-jsx-scope": "off",
		"react/jsx-filename-extension": ["error", { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
		"import/order": [
			"error",
			{
				groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
				"newlines-between": "always",
			},
		],
	},
	ignores: ["**/node_modules/**", "**/.next/**", "**/public/**"],
});
