import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useCreateMixtape, getListMixtapesQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GENRES = ["Afrobeats", "Hip Hop", "R&B", "Dancehall", "House", "Amapiano", "Pop", "Other"];

export default function AdminUpload() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createMutation = useCreateMixtape();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [tracklist, setTracklist] = useState("");
  const [featured, setFeatured] = useState(false);
  const [releaseDate, setReleaseDate] = useState("");
  
  const [coverPath, setCoverPath] = useState("");
  const [audioPath, setAudioPath] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !audioPath) {
      toast({ variant: "destructive", title: "Title and Audio file are required" });
      return;
    }

    try {
      await createMutation.mutateAsync({
        data: {
          title,
          description: description || null,
          genre: genre || null,
          tracklistText: tracklist || null,
          featured,
          releaseDate: releaseDate ? new Date(releaseDate).toISOString() : null,
          coverImagePath: coverPath || null,
          audioPath
        }
      });
      
      queryClient.invalidateQueries({ queryKey: getListMixtapesQueryKey() });
      toast({ title: "Mixtape uploaded successfully!" });
      setLocation("/admin");
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to create mixtape", description: (err as Error).message });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Upload Mixtape</h1>
        <p className="text-muted-foreground mt-1">Add a new mix to the vault</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Mixtape Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-background border-border" placeholder="e.g. Summer Vibes Vol 1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {GENRES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input id="releaseDate" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} className="bg-background border-border block" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="bg-background border-border" placeholder="Write a catchy description..." />
            </div>

            <div className="flex items-center space-x-2 bg-background border border-border p-4 rounded-xl">
              <Checkbox id="featured" checked={featured} onCheckedChange={(c) => setFeatured(!!c)} />
              <label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Feature this mixtape on Homepage
              </label>
            </div>
          </div>

          <div className="space-y-8">
            <FileUpload 
              label="Cover Artwork" 
              type="image" 
              accept="image/jpeg,image/png,image/webp" 
              maxSizeMB={5}
              value={coverPath}
              onChange={setCoverPath}
            />

            <FileUpload 
              label="Audio File (MP3) *" 
              type="audio" 
              accept="audio/mpeg,audio/mp3,audio/wav" 
              maxSizeMB={500}
              value={audioPath}
              onChange={setAudioPath}
            />

            <div className="space-y-2">
              <Label htmlFor="tracklist">Tracklist</Label>
              <Textarea id="tracklist" value={tracklist} onChange={(e) => setTracklist(e.target.value)} rows={6} className="bg-background border-border font-mono text-xs" placeholder="1. Artist - Track Name&#10;2. Artist - Track Name" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => setLocation("/admin")} className="rounded-full px-8 hover:bg-white/5 border-border">
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending || !audioPath} className="rounded-full px-8 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
            {createMutation.isPending ? "Publishing..." : "Publish Mixtape"}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
