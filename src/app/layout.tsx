import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// ─── Google Fonts ───────────────────────────────────────────────────────────
// Font chữ script cho tên người nhận
const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Font serif italic dự phòng / dùng cho nội dung phụ
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thiệp Mời Lễ Tốt Nghiệp",
  description:
    "Trân trọng kính mời bạn đến tham dự lễ tốt nghiệp của chúng tôi.",
  openGraph: {
    title: "Thiệp Mời Lễ Tốt Nghiệp",
    description: "Trân trọng kính mời bạn đến tham dự lễ tốt nghiệp.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${greatVibes.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
