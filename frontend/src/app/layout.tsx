import "./globals.css";
import PageTransition from "@/components/layout/PageTransition";
import CompanyLogo from "@/components/CompanyLogo";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased w-full h-screen overflow-hidden relative bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900" suppressHydrationWarning>
        <PageTransition>{children}</PageTransition>
        <CompanyLogo />
      </body>
    </html>
  );
}
