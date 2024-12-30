import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { GUI } from "lil-gui";
import { useEffect, useState } from "react";

import "./tailwind.css";
import FlickeringGrid from "./components/magicui/flickering-grid";
import { Toaster } from "./components/ui/toaster";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [backgroundColor, setBackgroundColor] = useState("#000");
  const [dotColor, setDotColor] = useState("#4b4b4b");

  useEffect(() => {
    const url = new URLSearchParams(window.location.search);

    if (url.get("devtool")) {
      const gui = new GUI();

      gui.addColor({ backgroundColor }, "backgroundColor");
      gui.addColor({ dotColor }, "dotColor");
      gui.onChange((event) => {
        if (event.property === "dotColor") {
          setDotColor(event.value);
        } else if (event.property === "backgroundColor") {
          setBackgroundColor(event.value);
        }
      });

      return () => {
        gui.destroy();
      };
    }
  }, [backgroundColor, dotColor]);

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div
          className="relative flex min-h-screen items-center overflow-hidden"
          style={{
            backgroundColor,
          }}
        >
          <FlickeringGrid
            className="absolute inset-0 z-0"
            squareSize={4}
            gridGap={6}
            color={dotColor}
            maxOpacity={0.5}
            flickerChance={0.1}
          />
          {children}
        </div>

        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
