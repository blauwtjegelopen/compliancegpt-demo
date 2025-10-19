// apps/web/components/Logo.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Logo({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const src = isDark ? "/logo-wordmark-light@3x_New.png" : "/logo-wordmark-dark@3x_New.png";
  return (
    <Link href="/" aria-label="LayerZero Home" className={`flex items-center ${className}`}>
      <Image
        src={src}
        alt={isDark ? "LayerZero Logo (white)" : "LayerZero Logo (black)"}
        width={240}
        height={52}
        priority
        onLoad={() => {}}
        className="h-auto w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
      />
    </Link>
  );
}