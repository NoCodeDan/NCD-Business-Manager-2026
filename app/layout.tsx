import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { AgentChat } from "@/components/agent/AgentChat";

export const metadata: Metadata = {
  title: "NCD Business Manager",
  description: "Personal business management app for SOPs, Projects, and Expenses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
          <AgentChat />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
