import type { Metadata } from "next";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import theme from "./theme";
import "./globals.css";

/* ========================================================================= */
export const metadata: Metadata = {
  title: "V-Projectz Web Portal",
  description: "Public-facing pages for apps under the V-Projectz organization",
};

/* ========================================================================= */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="antialiased">
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
