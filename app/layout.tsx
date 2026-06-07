import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/shared/ModelProvider";
import QueryClientProviderWrapper from "@/helpers/QueryClicentProviderWrapper";
import { Metadata } from "next";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Tenders.af",
	description: "Afghanistan Tenders and Contracts Portal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	console.log("hey ai rerendeing");
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<QueryClientProviderWrapper>
					<ModalProvider>{children}</ModalProvider>
					<Toaster richColors />
				</QueryClientProviderWrapper>
			</body>
		</html>
	);
}
