import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { Upload, Trash2, Edit2, Video, Music, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaItem {
  _id: string;
  url: string;
  title: string;
  uploadedAt: string;
}

interface MediaManagerProps {
  lessonId: string;
  type: 'video' | 'audio';
  mediaItems: MediaItem[];
  onUpdate: () => void;
}

export default function MediaManager({ lessonId, type, mediaItems, onUpdate }: MediaManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Fayl turini tekshirish
      const isVideo = selectedFile.type.startsWith('video/');
      const isAudio = selectedFile.type.startsWith('audio/');
      
      if (type === 'video' && !isVideo) {
        toast.error('Faqat video fayllar qabul qilinadi');
        return;
      }
      
      if (type === 'audio' && !isAudio) {
        toast.error('Faqat audio fayllar qabul qilinadi');
        return;
      }

      // Fayl hajmini tekshirish (500MB)
      if (selectedFile.size > 500 * 1024 * 1024) {
        toast.error('Fayl hajmi 500MB dan katta bo\'lmasligi kerak');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Fayl tanlang');
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('title', file.name);

      const response = await apiService.request(`/media/upload/${lessonId}`, {
        method: 'POST',
        body: formData,
        headers: {}, // FormData uchun Content-Type o'rnatilmaydi
      });

      if (response.success) {
        toast.success(`${type === 'video' ? 'Video' : 'Audio'} muvaffaqiyatli yuklandi!`);
        setFile(null);
        // File input'ni tozalash
        const fileInput = document.getElementById(`${type}-file-input`) as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        onUpdate();
      }
    } catch (error: any) {
      toast.error(error.message || `${type === 'video' ? 'Video' : 'Audio'} yuklashda xatolik`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (mediaId: string, url: string) => {
    if (!confirm(`${type === 'video' ? 'Video' : 'Audio'}ni o'chirishni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      const response = await apiService.request(`/media/${lessonId}/${mediaId}?type=${type}`, {
        method: 'DELETE',
      });

      if (response.success) {
        toast.success(`${type === 'video' ? 'Video' : 'Audio'} o'chirildi`);
        onUpdate();
      }
    } catch (error: any) {
      toast.error(error.message || `${type === 'video' ? 'Video' : 'Audio'} o'chirishda xatolik`);
    }
  };

  const handleEditStart = (item: MediaItem) => {
    setEditingId(item._id);
    setEditTitle(item.title);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleEditSave = async (mediaId: string) => {
    if (!editTitle.trim()) {
      toast.error('Nomi bo\'sh bo\'lmasligi kerak');
      return;
    }

    try {
      const response = await apiService.request(`/media/${lessonId}/${mediaId}`, {
        method: 'PUT',
        body: JSON.stringify({
          type,
          title: editTitle.trim(),
        }),
      });

      if (response.success) {
        toast.success('Muvaffaqiyatli yangilandi');
        setEditingId(null);
        setEditTitle('');
        onUpdate();
      }
    } catch (error: any) {
      toast.error(error.message || 'Yangilashda xatolik');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {type === 'video' ? (
          <Video className="w-5 h-5 text-primary" />
        ) : (
          <Music className="w-5 h-5 text-primary" />
        )}
        <h3 className="text-lg font-semibold text-foreground">
          {type === 'video' ? 'Videolar' : 'Audiolar'}
        </h3>
      </div>

      {/* Upload Section */}
      <div className="bg-muted rounded-lg p-4 border border-border">
        <div className="space-y-3">
          <div>
            <Label htmlFor={`${type}-file-input`} className="text-sm font-medium">
              {type === 'video' ? 'Video' : 'Audio'} fayl tanlang
            </Label>
            <Input
              id={`${type}-file-input`}
              type="file"
              accept={type === 'video' ? 'video/*' : 'audio/*'}
              onChange={handleFileSelect}
              className="mt-1"
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Maksimal hajm: 500MB
            </p>
          </div>
          
          {file && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <span className="font-medium">Tanlangan:</span>
              <span>{file.name}</span>
              <span className="text-muted-foreground">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            variant="gradient"
            size="sm"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Yuklanmoqda...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Yuklash
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Media List */}
      <div className="space-y-3">
        {mediaItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{type === 'video' ? 'Videolar' : 'Audiolar'} hali qo'shilmagan</p>
          </div>
        ) : (
          mediaItems.map((item) => (
            <div
              key={item._id}
              className="bg-card rounded-lg p-4 border border-border hover:border-primary/50 transition-colors"
            >
              {editingId === item._id ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1"
                    placeholder="Nomi"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditSave(item._id)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEditCancel}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.uploadedAt).toLocaleDateString('uz-UZ')}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-1 block truncate"
                    >
                      {item.url}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditStart(item)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item._id, item.url)}
                      className="text-error hover:text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
