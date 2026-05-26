"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { translations } from "@/lib/translations";
import type { Lang } from "@/lib/translations";

export function NavBar({ lang }: { lang: Lang }) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: translations.nav.pastLife[lang], href: "/" },
    { label: translations.nav.horoscope[lang], href: "/horoscope" },
    { label: translations.nav.blog[lang], href: "/blog" },
  ];

  return (
    <nav style={{
      width: "100%",
      padding: "1rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      maxWidth: "48rem",
      margin: "0 auto",
    }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <span style={{ fontSize: "1.5rem" }}>🐾</span>
      </Link>

      <div style={{ display: "flex", gap: "0.25rem" }}>
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: "0.85rem",
                fontWeight: 500,
                padding: "0.375rem 0.75rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                color: isActive ? "white" : "rgba(255,255,255,0.55)",
                backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                transition: "color 0.2s, background-color 0.2s",
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
