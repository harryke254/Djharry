import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useGetMixtape, useUpdateMixtape, getListMixtapesQueryKey, getGetMixtapeQueryKey } from "@workspace/api-client-react";
import { useLocation, useRoute } from "wouter";
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

export default function AdminEdit() {
  const [, params] = useRoute("/admin/edit/:id");
  const id = Number(params?.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const updateMutation = useUpdateMixtape();
  const queryClient = useQueryClient();

  const { data: mixtape, isLoading } = useGetMixtape(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [tracklist, setTracklist] = useState("");
  const [featured, setFeatured] = useState(false);
  const [releaseDate, setReleaseDate] = useState("");
  
  const [coverPath, setCoverPath] = useState("");
  const [audioPath, setAudioPath] = useState("");

  // Prefill form when data arrives
  useEffect(() => {
    if (mixtape) {
      setTitle(mixtape.title);
      setDescription(mixtape.description || "");
      setGenre(mixtape.genre || "");
      setTracklist(mixtape.tracklistText || "");
      setFeatured(mixtape.featured || false);
      setReleaseDate(mixtape.releaseDate ? new Date(mixtape.releaseDate).toISOString().split('T')[0] : "");
      setCoverPath(mixtape.coverImagePath || "");
      setAudioPath(mixtape.audioPath || "");
    }
  }, [mixtape]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !audioPath) {
      toast({ variant: "destructive", title: "Title and Audio file are required" });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
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
      queryClient.invalidateQueries({ queryKey: getGetMixtapeQueryKey(id) });
      toast({ title: "Mixtape updated successfully!" });
      setLocation("/admin");
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to update mixtape", description: (err as Error).message });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center p-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!mixtape) {
    return (
      <AdminLayout>
        <div className="p-20 text-center">Mixtape not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Edit Mixtape</h1>
        <p className="text-muted-foreground mt-1">Updating "{mixtape.title}"</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Mixtape Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-background border-border" />
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
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="bg-background border-border" />
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
              <Textarea id="tracklist" value={tracklist} onChange={(e) => setTracklist(e.target.value)} rows={6} className="bg-background border-border font-mono text-xs" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => setLocation("/admin")} className="rounded-full px-8 hover:bg-white/5 border-border">
            Cancel
          </Button>
          <Button type="submit" disabled={updateMutation.isPending || !audioPath} className="rounded-full px-8 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
