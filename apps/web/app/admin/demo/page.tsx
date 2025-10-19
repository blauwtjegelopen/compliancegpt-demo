// apps/web/app/admin/demo/page.tsx
import { redirect } from "next/navigation";

export default function AdminDemoRedirect() {
  redirect("/admin?tab=playground");
}