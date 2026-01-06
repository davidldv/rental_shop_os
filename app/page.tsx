import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-emerald-500/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="h-6 w-6 rounded-full bg-foreground" /> 
            <span>TallyRent</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#product" className="hover:text-foreground transition-colors">Product</Link>
            <Link href="#resources" className="hover:text-foreground transition-colors">Resources</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#docs" className="hover:text-foreground transition-colors">Docs</Link>
          </nav>

          <div className="flex items-center gap-6">
             <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
               Login
             </Link>
             <Link href="/signup" className="h-9 px-5 rounded-full bg-foreground text-sm font-medium text-background hover:bg-foreground/90 flex items-center justify-center transition-colors">
               Sign Up
             </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 md:pt-40 md:pb-48">
           {/* Background Glow */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-10 pointer-events-none">
             <div className="absolute inset-0 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 blur-[120px] rounded-full" />
           </div>

           <div className="container mx-auto px-6 relative z-10">
             <div className="mx-auto max-w-5xl text-center">
               <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 mb-8 backdrop-blur-sm">
                 <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                 The Operating System for Rental Businesses
               </div>
               
               <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
                 Manage inventory <br className="hidden md:block" />
                 with modern precision.
               </h1>
               
               <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-12 leading-relaxed">
                 Stop using spreadsheets. TallyRent provides a complete suite for tracking assets, 
                 preventing double bookings, and scaling your audiovisual business.
               </p>

               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link href="/dashboard" className="h-12 px-8 rounded-full bg-foreground text-background text-base font-medium hover:bg-foreground/90 flex items-center justify-center transition-all shadow-lg hover:shadow-emerald-500/20">
                   Start Building
                 </Link>
                 <div className="h-12 px-8 rounded-full border border-border bg-white/2 text-muted-foreground text-base font-medium flex items-center justify-center font-mono">
                   npm create rental-os@latest
                 </div>
               </div>
             </div>
           </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 border-t border-border/40">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { title: "Asset Tracking", desc: "Know exactly where every lens, camera, and cable is in real-time." },
                 { title: "Conflict Detection", desc: "Our engine automatically flags double bookings before they happen." },
                 { title: "Financial Reporting", desc: "Visualize revenue, calculate late fees, and manage deposits effortlessly." }
               ].map((f, i) => (
                 <div key={i} className="group p-8 rounded-3xl border border-border/40 bg-card hover:bg-white/4 transition-colors relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-emerald-400 transition-colors relative z-10">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed relative z-10">{f.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          &copy; 2026 Rental Shop OS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
