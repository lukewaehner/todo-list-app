import { Inter } from "next/font/google";
import "./globals.css";
import setupAxiosInterceptors from "./lib/utils/axios";
import Header from "./lib/components/header.js";
import { UserProvider } from "./lib/utils/UserProvider";
import PageTransition from "./lib/utils/PageTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Todo List",
  description: "Simple todo list",
};

export default function RootLayout({ children }) {
  setupAxiosInterceptors();

  return (
    <UserProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          <PageTransition>{children}</PageTransition>
        </body>
      </html>
    </UserProvider>
  );
}
