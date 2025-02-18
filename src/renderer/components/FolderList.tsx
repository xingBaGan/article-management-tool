import React from 'react';
import { Folder as FolderIcon } from 'lucide-react';
import { Folder } from '../types';
import clsx from 'clsx';

interface FolderListProps {
  folders: Folder[];
  selectedFolder: Folder | null;
  onSelectFolder: (folder: Folder | null) => void;
}

export function FolderList({ folders, selectedFolder, onSelectFolder }: FolderListProps) {
  return (
    <div className="h-full w-64 bg-gray-100 p-4 border-r border-gray-200 overflow-y-auto" onClick={() => onSelectFolder(null)}>
      <h2 className="text-lg font-semibold mb-4">Folders</h2>
      <div className="space-y-2">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={(e) => {
              onSelectFolder(folder)
              e.stopPropagation()
            }}
            className={clsx(
              "w-full flex items-center space-x-2 p-2 rounded-lg transition-colors",
              selectedFolder?.id === folder.id
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-200"
            )}
          >
            <FolderIcon className="w-5 h-5" />
            <span className="truncate">{folder.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}