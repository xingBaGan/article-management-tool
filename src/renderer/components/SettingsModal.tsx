import React, { useState, useEffect } from 'react';
import { X, GitBranch, Upload } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  useEffect(() => {
    // 加载已保存的设置
    window.electron?.getSettings().then((settings: any) => {
      setRepoUrl(settings.repoUrl || '');
    });
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await window.electron?.saveSettings({
        repoUrl
      });
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
      // 这里可以添加错误提示
    } finally {
      setIsSaving(false);
    }
  };

  const handleInitRepo = async () => {
    try {
      setIsInitializing(true);
      await window.electron?.initRepo(repoUrl);
    } catch (error) {
      console.error('Failed to initialize repository:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handlePushRepo = async () => {
    try {
      setIsPushing(true);
      await window.electron?.pushRepo();
    } catch (error) {
      console.error('Failed to push repository:', error);
    } finally {
      setIsPushing(false);
    }
  };

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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Git Repository</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleInitRepo}
                  disabled={isInitializing || !repoUrl}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Initialize Repository"
                >
                  <GitBranch className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePushRepo}
                  disabled={isPushing || !repoUrl}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Push Changes"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}