import type { Metadata } from "next";
import { Inter, Chivo, DM_Serif_Text, Edu_SA_Beginner  } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from './ConvexClientProvider';



const inter = Inter({ subsets: ["latin"] });
const chivo = Chivo({ subsets: ["latin"] });
const serfi = DM_Serif_Text({ weight: "400", subsets: ["latin"] });
const edu = Edu_SA_Beginner({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NewPals",
  description: "Make form connections from your camera roll",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <ConvexClientProvider>
      <body className={`${chivo.className}  ${serfi.className} ${edu.className}`}>{children}</body>
      </ConvexClientProvider>
    </html>
  );
}
