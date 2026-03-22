import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileAudio, Image as ImageIcon, X } from "lucide-react";
import { uploadFile } from "@/lib/storage";

interface FileUploadProps {
  label: string;
  accept: string;
  type: "audio" | "image";
  value?: string;
  onChange: (path: string) => void;
  maxSizeMB?: number;
}

export function FileUpload({ label, accept, type, value, onChange, maxSizeMB = 500 }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(value ? "Existing file selected" : null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds limit of ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);
    setFilename(file.name);

    try {
      const objectPath = await uploadFile(file, (p) => setProgress(p));
      onChange(objectPath);
      setIsUploading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsUploading(false);
      setFilename(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearFile = () => {
    onChange("");
    setFilename(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      
      <div className={`
        relative border-2 border-dashed rounded-xl p-6 transition-all duration-300
        ${isUploading ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-white/5'}
      `}>
        {isUploading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground truncate max-w-[200px]">{filename}</span>
              <span className="text-primary font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-background" />
            <p className="text-xs text-center text-muted-foreground animate-pulse">Uploading to cloud...</p>
          </div>
        ) : value ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-primary">
              {type === 'audio' ? <FileAudio className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
              <span className="font-medium truncate max-w-[200px]">{filename}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={clearFile} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <X className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium">Click to select or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept.replace(/audio\/|image\//g, '').replace(/,/g, ', ')} (Max {maxSizeMB}MB)
            </p>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          accept={accept} 
          onChange={handleFileChange} 
          className="hidden" 
          disabled={isUploading}
        />
      </div>
      
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
