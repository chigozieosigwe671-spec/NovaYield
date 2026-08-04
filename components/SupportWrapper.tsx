"use client";

import { usePathname } from "next/navigation";
import SupportWidget from "@/components/support/SupportWidget";

export default function SupportWrapper() {
  const pathname = usePathname();

  const hideSupport = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/admin",
  ].some((path) => pathname.startsWith(path));

  if (hideSupport) return null;

  return <SupportWidget />;
}