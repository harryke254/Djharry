import { PublicLayout } from "@/components/PublicLayout";
import { MixtapeCard } from "@/components/MixtapeCard";
import { useListMixtapes } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Music, Headphones, Disc } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data, isLoading } = useListMixtapes({ limit: 4 });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="DJ Harry Mr Street Sensation Concert" 
            className="w-full h-full object-cover"
          />
          {/* Gradients to blend into background */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-primary font-medium text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              World Class DJ Mixes
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display tracking-tighter leading-[1.1] text-white drop-shadow-2xl">
              FEEL THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                VIBE
              </span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-300 max-w-xl font-medium leading-relaxed">
              Stream and download exclusive premium mixtapes. Hip Hop, Afrobeats, Dancehall, and more.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all hover:scale-105 active:scale-95">
                <Link href="/mixtapes">
                  <Headphones className="mr-2 w-5 h-5" /> Listen Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-bold border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                <a href="#featured">
                  View Featured
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="py-24 bg-background relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white flex items-center gap-4">
                <Music className="text-primary w-10 h-10" />
                Latest Drops
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">Fresh out the studio.</p>
            </div>
            <Link href="/mixtapes" className="hidden sm:flex items-center text-primary font-bold hover:underline transition-all hover:gap-2">
              View All <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-card rounded-2xl h-[400px]"></div>
              ))}
            </div>
          ) : data?.mixtapes.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-white/5">
              <Disc className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold">No mixtapes yet</h3>
              <p className="text-muted-foreground">Check back later for new releases.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data?.mixtapes.map((mixtape, index) => (
                <motion.div
                  key={mixtape.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <MixtapeCard mixtape={mixtape} />
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-10 sm:hidden">
             <Button asChild variant="outline" className="w-full rounded-full">
                <Link href="/mixtapes">View All Mixtapes</Link>
             </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
