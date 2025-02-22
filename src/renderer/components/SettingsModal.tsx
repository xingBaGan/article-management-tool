import React, { useState, useEffect } from 'react';
import { X, GitBranch, Upload, RotateCw, Download, RefreshCw } from 'lucide-react';
import availableTemplates from '../../../templates/templates_avaliable.json';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Template {
  name: string;
  url: string;
}

export function SettingsModal({ isOpen, onClose, onSuccess }: SettingsModalProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isInitialed, setIsInitialed] = useState(false);
  const [forceSync, setForceSync] = useState(false);
  const [templates, setTemplates] = useState<Template[]>(availableTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string>();
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isTemplateUpdating, setIsTemplateUpdating] = useState(false);
  const [isTemplateExists, setIsTemplateExists] = useState(false);

  useEffect(() => {
    window.electron?.getIsInitialed().then((isInitialed: any) => {
      setIsInitialed(isInitialed);
    });
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      window.electron?.isTemplateExists(selectedTemplate).then((isExists: any) => {
        setIsTemplateExists(isExists);
      });
    }
  }, [selectedTemplate]);

  useEffect(() => {
    // Load saved settings
    window.electron?.getSettings().then((settings: any) => {
      setRepoUrl(settings.repoUrl || '');
      setSelectedTemplate(settings.selectedTemplate || '');
    });
  }, []);


  // 定义一个异步函数handleSave，用于保存设置
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await window.electron?.saveSettings({
        repoUrl,
        selectedTemplate
      });
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInitRepo = async () => {
    try {
      setIsInitializing(true);
      await window.electron?.initRepo(repoUrl);
      setIsInitialed(true);
    } catch (error) {
      console.error('Failed to initialize repository:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handlePushRepo = async () => {
    try {
      setIsPushing(true);
      const res = await window.electron?.pushRepo(forceSync);
      if (res.success) {
        window.electron?.log.info('Push repository successfully');
      } else {
        window.electron?.log.error('Failed to push repository:', res.error);
      }
    } catch (error) {
      console.error('Failed to push repository:', error);
    } finally {
      setIsPushing(false);
    }
  };

  const handleInitializeTemplate = async () => {
    try {
      setIsTemplateLoading(true);
      console.log('template', selectedTemplate);
      const selectedTemplateData = templates.find(t => t.name === selectedTemplate);
      if (!selectedTemplateData) {
        window.electron?.log.error('Selected template not found');
        return;
      }
      
      const result = await window.electron.initializeBlogTemplate(
        selectedTemplateData.name,
        selectedTemplateData.url
      );
      
      if (result.success) {
        window.electron?.log.info(result.message);
      } else {
        window.electron?.log.error(result.message);
      }
    } catch (error) {
      window.electron?.log.error('Failed to initialize template');
    } finally {
      setIsTemplateLoading(false);
    }
  };

  const handleUpdateTemplate = async () => {
    try {
      setIsTemplateUpdating(true);
      const selectedTemplateData = templates.find(t => t.name === selectedTemplate);
      if (!selectedTemplateData) {
        window.electron?.log.error('Selected template not found');
        return;
      }
      
      const result = await window.electron.updateBlogTemplate(selectedTemplateData.name);
      if (result.success) {
        window.electron?.log.info(result.message);
      } else {
        window.electron?.log.error(result.message);
      }
    } catch (error) {
      window.electron?.log.error('Failed to update template');
    } finally {
      setIsTemplateUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/20"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-[480px] rounded-2xl overflow-hidden">
        {/* Frosted glass effect */}
        <div className="absolute inset-0 backdrop-blur-xl bg-white/30" />

        {/* Content */}
        <div className="relative p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full transition-colors hover:bg-black/5"
              title="Close Settings"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">Blog Template</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleInitializeTemplate}
                  disabled={isTemplateExists || isTemplateLoading}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Initialize Template"
                >
                  {isTemplateLoading ? (
                    <div className="animate-spin">
                      <RotateCw className="w-4 h-4" />
                    </div>
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleUpdateTemplate}
                  disabled={!isTemplateExists || isTemplateUpdating}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Update Template"
                >
                  {isTemplateUpdating ? (
                    <div className="animate-spin">
                      <RotateCw className="w-4 h-4" />
                    </div>
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <select
              value={selectedTemplate}
              onChange={(e) => {
                setSelectedTemplate(e.target.value);
              }}
              className="px-3 py-2 w-full text-sm rounded-md border border-gray-300"
              aria-label="Select Blog Template"
            >
              <option value="">Select Blog Template</option>
              {templates?.map((template) => (
                <option key={template.name} value={template.name}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">Git Repository</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleInitRepo}
                  disabled={isInitialed || isInitializing || !repoUrl}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Initialize Repository"
                >
                  <GitBranch className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePushRepo}
                  disabled={isInitialed || isPushing || !repoUrl}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Push Changes"
                >
                  {isPushing ? (
                    <div className="animate-spin">
                      <RotateCw className="w-4 h-4" />
                    </div>
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="px-3 py-2 w-full text-sm rounded-md border border-gray-300"
            />
          </div>

          <div className="flex gap-2 items-center mt-4">
            <input
              type="checkbox"
              id="forceSync"
              checked={forceSync}
              onChange={(e) => setForceSync(e.target.checked)}
            />
            <label htmlFor="forceSync" className="text-sm text-gray-600">
              Force Sync (Use with caution, will overwrite remote repository content!!!)
            </label>
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