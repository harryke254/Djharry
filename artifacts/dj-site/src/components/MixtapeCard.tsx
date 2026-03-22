import { Link } from "wouter";
import { Play } from "lucide-react";
import { getStorageUrl } from "@/lib/storage";
import type { Mixtape } from "@workspace/api-client-react/src/generated/api.schemas";
import { format } from "date-fns";

export function MixtapeCard({ mixtape }: { mixtape: Mixtape }) {
  const coverUrl = getStorageUrl(mixtape.coverImagePath);

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.3)]">
      <Link href={`/mixtapes/${mixtape.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {mixtape.title}</span>
      </Link>
      
      <div className="relative aspect-square overflow-hidden bg-background">
        <img 
          src={coverUrl} 
          alt={mixtape.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg shadow-primary/40">
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Genre Badge */}
        {mixtape.genre && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border border-white/10 text-primary">
            {mixtape.genre}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
          {mixtape.title}
        </h3>
        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
          <span>{mixtape.releaseDate ? format(new Date(mixtape.releaseDate), "MMM yyyy") : "Recent"}</span>
          <span>{mixtape.downloadCount || 0} plays</span>
        </div>
      </div>
    </div>
  );
}
