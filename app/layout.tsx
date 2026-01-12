import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { AgentChat } from "@/components/agent/AgentChat";

export const metadata: Metadata = {
  title: "NCD Business Manager",
  description: "Personal business management app for SOPs, Projects, and Expenses",
};

// Script to prevent theme flash on page load
const themeInitScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
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
