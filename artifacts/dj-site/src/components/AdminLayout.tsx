import { Link, useLocation } from "wouter";
import { isAdmin, logoutAdmin } from "@/lib/auth";
import { useEffect } from "react";
import { Disc, LayoutDashboard, PlusCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isAdmin() && location !== '/admin/login') {
      setLocation('/admin/login');
    }
  }, [location, setLocation]);

  if (!isAdmin() && location !== '/admin/login') return null;

  const handleLogout = () => {
    logoutAdmin();
    setLocation('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border md:h-screen sticky top-0 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <Disc className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg">DJ HARRY MR STREET SENSATION</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link 
            href="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location === '/admin' ? 'bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link 
            href="/admin/upload"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location === '/admin/upload' ? 'bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
          >
            <PlusCircle className="w-5 h-5" />
            Upload Mixtape
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 md:h-screen md:overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
