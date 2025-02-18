import React from 'react';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-[480px] rounded-2xl overflow-hidden">
        {/* Frosted glass effect */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-xl" />
        
        {/* Content */}
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Theme</h3>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                  Light
                </button>
                <button className="px-4 py-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                  Dark
                </button>
                <button className="px-4 py-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                  System
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Editor</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Auto-save</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Spell check</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}