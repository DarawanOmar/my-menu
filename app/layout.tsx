import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Fraunces, Geist } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { Banner } from "@/components/banner";
import { CartBar } from "@/components/cart/cart-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { CategoryBar } from "@/components/category-bar";
import { ProductSheet } from "@/components/product-sheet";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/* Display — headings, prices, tabs. Variable, with the optical-size axis. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

/* Body — everything else. */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

/* Outlier — the wordmark and the footer statement only. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: "normal",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Birga Restaurant — Menu",
  description:
    "Explore the menu at Birga Restaurant in Erbil – Shorsh. Fresh dishes, warm hospitality, and flavors worth coming back for.",
};

export const viewport: Viewport = {
  themeColor: "#f7faf7",
  viewportFit: "cover",
};

/**
 * The shell (header, hero, category tabs, footer) lives in the layout so it
 * persists across category navigations — the active tab slides instead of
 * re-rendering, and cart / sheet state survives route changes.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${geist.variable} ${fraunces.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <CartProvider>
          <AppShell>
            <SiteHeader />
            <Banner />
            <CategoryBar />
            <main id="menu" className="flex flex-1 flex-col scroll-mt-16">
              {children}
            </main>
            <SiteFooter />
          </AppShell>

          {/* Overlays sit outside the shell so they stay interactive while it is inert. */}
          <ProductSheet />
          <CartDrawer />
          <CartBar />
        </CartProvider>
      </body>
    </html>
  );
}
