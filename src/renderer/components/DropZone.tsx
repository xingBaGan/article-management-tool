import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FolderUp } from 'lucide-react';

interface DropZoneProps {
  onFolderDrop: (folderEntries: any[]) => void;
}

export function DropZone({ onFolderDrop }: DropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // In a real implementation, we would process the folder contents here
    console.log('Dropped files:', acceptedFiles);
    onFolderDrop(acceptedFiles);
  }, [onFolderDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`fixed inset-0 pointer-events-none ${
        isDragActive ? 'bg-blue-500/20' : ''
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center space-y-4 p-8 rounded-lg border-2 border-dashed border-blue-500">
            <FolderUp className="w-12 h-12 text-blue-500" />
            <p className="text-lg font-medium text-blue-700">
              Drop folder here to import
            </p>
          </div>
        </div>
      )}
    </div>
  );
}