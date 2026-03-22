import { useState } from "react";
import { useLocation } from "wouter";
import { loginAdmin } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Disc, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      setLocation("/admin");
      toast({ title: "Welcome back, DJ Harry Mr Street Sensation" });
    } else {
      toast({ variant: "destructive", title: "Incorrect Password" });
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary/30">
      <div className="w-full max-w-md bg-card border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)] mb-4">
            <Disc className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-black text-white">Admin Access</h1>
          <p className="text-muted-foreground mt-2">Enter credentials to manage mixtapes</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 h-14 bg-background border-border text-lg rounded-xl focus-visible:ring-primary"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
