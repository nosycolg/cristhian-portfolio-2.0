import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
	title: "Cristhian Portfolio",
	description: "Cristhian Portfolio",
	generator: "v0.dev",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body>{children}</body>
		</html>
	);
}
