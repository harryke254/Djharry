import { useRoute } from "wouter";
import { PublicLayout } from "@/components/PublicLayout";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useGetMixtape } from "@workspace/api-client-react";
import { getStorageUrl } from "@/lib/storage";
import { format } from "date-fns";
import { Calendar, Headphones, Tag, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function MixtapeDetail() {
  const [, params] = useRoute("/mixtapes/:id");
  const id = Number(params?.id);
  const { data: mixtape, isLoading, error } = useGetMixtape(id);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !mixtape) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-destructive">Mixtape not found</h2>
          <Link href="/mixtapes" className="text-primary hover:underline mt-4 inline-block">Back to Mixtapes</Link>
        </div>
      </PublicLayout>
    );
  }

  const coverUrl = getStorageUrl(mixtape.coverImagePath);
  const audioUrl = getStorageUrl(mixtape.audioPath);

  return (
    <PublicLayout>
      <div className="relative min-h-screen pb-20">
        
        {/* Dynamic Background Blur */}
        <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden -z-10 opacity-30">
          <img src={coverUrl} className="w-full h-full object-cover blur-3xl scale-125" alt="Blur" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/mixtapes" className="inline-flex items-center text-muted-foreground hover:text-white transition-colors mb-8 font-medium">
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Collection
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <AudioPlayer 
              audioUrl={audioUrl} 
              title={mixtape.title} 
              coverUrl={coverUrl} 
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-2xl font-display font-bold text-white mb-4">About The Mix</h3>
                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {mixtape.description || "No description provided."}
                </div>
              </section>

              {mixtape.tracklistText && (
                <section>
                  <h3 className="text-2xl font-display font-bold text-white mb-4 border-t border-white/5 pt-8">Tracklist</h3>
                  <div className="bg-card/50 border border-white/5 rounded-xl p-6">
                    <pre className="font-sans text-sm text-muted-foreground whitespace-pre-wrap">
                      {mixtape.tracklistText}
                    </pre>
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-white/5 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-white uppercase tracking-wider text-sm border-b border-white/5 pb-3">Details</h4>
                
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Tag className="w-5 h-5 text-primary" />
                  <span className="font-medium">{mixtape.genre || "Multi-Genre"}</span>
                </div>
                
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    {mixtape.releaseDate ? format(new Date(mixtape.releaseDate), "MMMM do, yyyy") : format(new Date(mixtape.createdAt), "MMMM do, yyyy")}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Headphones className="w-5 h-5 text-primary" />
                  <span className="font-medium">{mixtape.downloadCount || 0} Downloads</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
