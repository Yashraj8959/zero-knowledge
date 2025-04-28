import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import {dark} from '@clerk/themes'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EduSync",
  description: "A career growth app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >

    <html lang="en" suppressHydrationWarning>
       <head />
        <body className={`${inter.className} dark`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* header */}
            <Header />
            {/* main content */}
            <main className="min-h-screen w-full">
            {children}
            </main>
            {/* footer */}
            <footer className="bg-muted/80 py-12">
              <div className="container mx-auto px-4 text-center text-muted-foreground">
              <p>&copy; 2022 EduSync</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
    </html>
    </ClerkProvider>

  );
}
