import { AdminLayout } from "@/components/AdminLayout";
import { useListMixtapes, useDeleteMixtape, getListMixtapesQueryKey } from "@workspace/api-client-react";
import { getStorageUrl } from "@/lib/storage";
import { Link } from "wouter";
import { format } from "date-fns";
import { Edit, Trash2, Plus, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const { data, isLoading } = useListMixtapes({ limit: 100 });
  const deleteMutation = useDeleteMixtape();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListMixtapesQueryKey() });
      toast({ title: "Mixtape deleted successfully" });
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to delete mixtape" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your mixtapes collection</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          <Link href="/admin/upload">
            <Plus className="w-5 h-5 mr-2" /> New Mixtape
          </Link>
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-10 flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : data?.mixtapes.length === 0 ? (
          <div className="p-16 text-center">
            <Headphones className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold">No mixtapes yet</h3>
            <p className="text-muted-foreground mb-6">Upload your first mix to get started.</p>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/admin/upload">Upload Mixtape</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Mixtape</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Genre</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Downloads</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.mixtapes.map((mix) => (
                  <tr key={mix.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={getStorageUrl(mix.coverImagePath)} 
                          alt="Cover" 
                          className="w-12 h-12 rounded-md object-cover border border-white/10"
                        />
                        <div>
                          <div className="font-bold text-foreground">{mix.title}</div>
                          {mix.featured && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wide">Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">{mix.genre || '-'}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {mix.releaseDate ? format(new Date(mix.releaseDate), "MMM dd, yyyy") : '-'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{mix.downloadCount || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="icon" variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
                          <Link href={`/admin/edit/${mix.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Mixtape?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{mix.title}"? This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-transparent border-border hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(mix.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
