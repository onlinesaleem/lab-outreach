
import "../styles/globals.css";
import { Inter } from "next/font/google";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lab Report System",
  description: "Manage lab reports efficiently",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex`}>
        <SessionProviderWrapper>
          <Sidebar />
          <div className="flex flex-col w-full">
            <TopBar />
            <main className="p-6 bg-gray-100 min-h-screen">{children}</main>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
