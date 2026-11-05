import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNDIP Major Matcher — Find Your Future at UNDIP",
  description:
    "Platform eksplorasi minat untuk menemukan program studi Universitas Diponegoro yang paling sesuai dengan preferensi dan ketertarikanmu.",
  keywords: [
    "UNDIP",
    "Universitas Diponegoro",
    "program studi",
    "rekomendasi jurusan",
    "minat kuliah",
    "tes minat",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-bg">
        {children}
      </body>
    </html>
  );
}
