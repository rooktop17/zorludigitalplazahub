import { useState, useRef } from 'react';
import { Upload, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (url: string) => void;
}

const PhotoUpload = ({ currentPhotoUrl, onPhotoChange }: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Hata', description: 'Lütfen bir resim dosyası seçin.', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Hata', description: 'Dosya boyutu 5MB\'dan küçük olmalıdır.', variant: 'destructive' });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('employee-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('employee-photos')
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onPhotoChange(publicUrl);
      toast({ title: 'Başarılı', description: 'Fotoğraf yüklendi.' });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({ title: 'Hata', description: 'Fotoğraf yüklenemedi.', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    onPhotoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-dashed border-border">
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Fotoğraf önizleme" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Yükleniyor...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Fotoğraf Yükle
              </span>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF (max 5MB)</p>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
