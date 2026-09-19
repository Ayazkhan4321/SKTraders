import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Video, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { uploadFile, FileCategory } from '../services/storageApi';

interface FileUploadProps {
  label: string;
  category: FileCategory;
  accept: string;
  currentUrl?: string;
  onUploadSuccess: (url: string, fileName?: string) => void;
  onRemove?: () => void;
  helpText?: string;
}

export default function FileUpload({
  label,
  category,
  accept,
  currentUrl,
  onUploadSuccess,
  onRemove,
  helpText,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const result = await uploadFile(file, category);
    setUploading(false);

    if (result.success && result.url) {
      setFileName(result.name || file.name);
      onUploadSuccess(result.url, result.name);
    } else {
      setError(result.error || 'Upload failed');
    }
  };

  const handleClear = () => {
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  const isVideo = category.endsWith('videos');
  const isPdf = category.endsWith('pdfs');

  return (
    <div className="space-y-2 font-sans">
      <label className="block text-xs font-bold text-slate-300 tracking-wide uppercase">
        {label}
      </label>

      {currentUrl ? (
        <div className="relative p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl flex items-center justify-between gap-3 group">
          <div className="flex items-center gap-3 overflow-hidden">
            {isVideo ? (
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Video className="w-6 h-6 text-blue-400" />
              </div>
            ) : isPdf ? (
              <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-red-400" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
                <img src={currentUrl} alt="Upload Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-0.5 overflow-hidden">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>File Uploaded</span>
              </div>
              <p className="text-xs text-slate-300 font-medium truncate max-w-[200px] sm:max-w-[300px]">
                {fileName || currentUrl}
              </p>
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-cyan-400 hover:underline"
              >
                View / Open File
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Change
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                title="Remove File"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative p-5 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            uploading
              ? 'border-cyan-500/50 bg-cyan-500/5'
              : 'border-slate-700 hover:border-cyan-500/50 bg-slate-900/50 hover:bg-slate-900/80'
          }`}
        >
          {uploading ? (
            <div className="py-2 flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <span className="text-xs font-semibold text-slate-300">Uploading File...</span>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                {isVideo ? (
                  <Video className="w-5 h-5 text-cyan-400" />
                ) : isPdf ? (
                  <FileText className="w-5 h-5 text-red-400" />
                ) : (
                  <UploadCloud className="w-5 h-5 text-cyan-400" />
                )}
              </div>
              <p className="text-xs font-semibold text-slate-200">
                Click or drag & drop to upload <span className="text-cyan-400">{label}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                {helpText || `Allowed formats: ${accept}`}
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
