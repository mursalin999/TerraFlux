import { createFileRoute } from "@tanstack/react-router";
import { AdminImportForm } from "@/components/AdminImportForm";

export const Route = createFileRoute("/admin/import")({
  head: () => ({ meta: [{ title: "Private FIRMS Import — TerraFlux" }, { name: "robots", content: "noindex,nofollow,noarchive" }] }),
  component: AdminImportPage,
});

function AdminImportPage() { return <AdminImportForm />; }
