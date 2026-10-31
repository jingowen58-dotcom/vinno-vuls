import { Noto_Sans_SC } from "next/font/google";
import type { ReactNode } from "react";

const noto = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto",
});

export default function ZhLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="zh-CN" className={`${noto.variable} locale-zh`}>
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='zh-CN'" }} />
      {children}
    </div>
  );
}
