import { useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { MixtapeCard } from "@/components/MixtapeCard";
import { useListMixtapes } from "@workspace/api-client-react";
import { Disc, Filter } from "lucide-react";

const GENRES = ["All", "Afrobeats", "Hip Hop", "R&B", "Dancehall", "House", "Amapiano", "Pop", "Other"];

export default function Mixtapes() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  
  const { data, isLoading } = useListMixtapes({ 
    limit: 50,
    genre: selectedGenre === "All" ? undefined : selectedGenre 
  });

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight text-white mb-4">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Vault</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore the complete collection of premium DJ Harry Mr Street Sensation mixtapes. Filter by genre and find your perfect vibe.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 pb-6 border-b border-white/5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 text-muted-foreground mr-4">
            <Filter className="w-5 h-5" />
            <span className="font-semibold uppercase tracking-wider text-sm">Filter:</span>
          </div>
          <div className="flex items-center gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedGenre === genre 
                    ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
                    : 'bg-card border border-white/5 text-muted-foreground hover:text-white hover:border-white/20'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl h-[400px]"></div>
            ))}
          </div>
        ) : data?.mixtapes.length === 0 ? (
          <div className="text-center py-32 bg-card rounded-3xl border border-white/5">
            <Disc className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">No mixtapes found</h3>
            <p className="text-muted-foreground">We couldn't find any mixtapes matching that genre.</p>
            <button 
              onClick={() => setSelectedGenre("All")}
              className="mt-6 text-primary hover:underline font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {data?.mixtapes.map((mixtape) => (
              <MixtapeCard key={mixtape.id} mixtape={mixtape} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
