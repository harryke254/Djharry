import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Download, Disc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStorageUrl } from "@/lib/storage";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  coverUrl?: string;
  downloadable?: boolean;
}

export function AudioPlayer({ audioUrl, title, coverUrl, downloadable = true }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setProgress(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.volume = newMutedState ? 0 : volume || 1;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Record/Cover Artwork */}
        <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
          <div className={`absolute inset-0 rounded-full border-4 border-white/10 overflow-hidden ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            {coverUrl ? (
              <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                <Disc className="w-16 h-16 text-white/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
            {/* Center Hole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full border border-white/20"></div>
          </div>
        </div>

        <div className="flex-1 w-full space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground font-display">{title}</h2>
              <p className="text-primary font-medium mt-1">DJ Harry Mr Street Sensation Exclusive</p>
            </div>
            {downloadable && (
              <Button asChild variant="outline" className="rounded-full gap-2 border-white/10 hover:border-primary/50 hover:bg-primary/10">
                <a href={audioUrl} download target="_blank" rel="noreferrer">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </Button>
            )}
          </div>

          {/* Scrubber */}
          <div className="space-y-2">
            <input 
              type="range" 
              min="0" 
              max={duration || 100} 
              value={progress} 
              onChange={handleSeek}
            />
            <div className="flex justify-between text-xs font-medium text-muted-foreground font-mono">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 ml-1" fill="currentColor" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggleMute} className="text-muted-foreground hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input 
                type="range" 
                min="0" max="1" step="0.01" 
                value={isMuted ? 0 : volume} 
                onChange={handleVolume}
                className="w-24"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
