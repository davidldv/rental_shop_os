import { verifySession } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifySession();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
           <div className="font-semibold tracking-tight text-lg">Rental OS <span className="text-muted-foreground font-normal">/ Dashboard</span></div>
           <div className="flex gap-4 text-sm items-center">
             <a href="/widget" className="text-muted-foreground hover:text-foreground transition-colors">Widget</a>
             <LogoutButton />
           </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {children}
      </div>
    </div>
  );
}
