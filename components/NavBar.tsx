"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Past Life", href: "/" },
  { label: "Horoscope", href: "/horoscope" },
  { label: "Blog", href: "/blog" },
];

export function NavBar() {
  const pathname = usePathname();

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
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.25rem" }}>🐾</span>
        <span style={{
          fontFamily: "var(--font-italiana), Georgia, serif",
          fontSize: "1.1rem",
          color: "white",
          letterSpacing: "0.02em",
        }}>
          PetPastLife
        </span>
      </Link>

      {/* Links */}
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
