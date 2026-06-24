'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Keyboard, 
  Globe, 
  Bell, 
  Shield,
  Database,
  ChevronRight,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingSection {
  id: string;
  title: string;
  icon: any;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'input' | 'action';
  value?: any;
  options?: string[];
}

export function SettingsPanel() {
  // State for settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [settings, setSettings] = useState<Record<string, any>>({
    'theme': 'dark',
    'font-size': '14',
    'animations': true,
    'glass-effect': true,
    'word-wrap': true,
    'minimap': true,
    'line-numbers': true,
    'auto-save': true,
    'vim-mode': false,
    'model': 'gpt-4',
    'temperature': '0.7',
    'streaming': true,
    'alerts': true,
    'sounds': false,
    'telemetry': false,
    'local-storage': true,
  });

  const sections: SettingSection[] = [
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      items: [
        { id: 'theme', label: 'Theme', description: 'Select your preferred color scheme', type: 'select', value: settings['theme'], options: ['Dark', 'Light', 'System'] },
        { id: 'font-size', label: 'Font Size', description: 'Adjust the editor font size', type: 'select', value: settings['font-size'], options: ['12', '14', '16', '18'] },
        { id: 'animations', label: 'Animations', description: 'Enable smooth animations', type: 'toggle', value: settings['animations'] },
        { id: 'glass-effect', label: 'Glass Effects', description: 'Use glassmorphism effects', type: 'toggle', value: settings['glass-effect'] },
      ],
    },
    {
      id: 'editor',
      title: 'Editor',
      icon: Settings,
      items: [
        { id: 'word-wrap', label: 'Word Wrap', description: 'Wrap long lines of text', type: 'toggle', value: settings['word-wrap'] },
        { id: 'minimap', label: 'Minimap', description: 'Show code minimap', type: 'toggle', value: settings['minimap'] },
        { id: 'line-numbers', label: 'Line Numbers', description: 'Show line numbers', type: 'toggle', value: settings['line-numbers'] },
        { id: 'auto-save', label: 'Auto Save', description: 'Automatically save files', type: 'toggle', value: settings['auto-save'] },
      ],
    },
    {
      id: 'keyboard',
      title: 'Keyboard',
      icon: Keyboard,
      items: [
        { id: 'shortcuts', label: 'Keyboard Shortcuts', description: 'View and customize shortcuts', type: 'action' },
        { id: 'vim-mode', label: 'Vim Mode', description: 'Enable Vim keybindings', type: 'toggle', value: settings['vim-mode'] },
      ],
    },
    {
      id: 'ai',
      title: 'AI Settings',
      icon: Globe,
      items: [
        { id: 'model', label: 'AI Model', description: 'Select AI model', type: 'select', value: settings['model'], options: ['GPT-4', 'GPT-4 Turbo', 'Claude 3'] },
        { id: 'temperature', label: 'Temperature', description: 'AI creativity level', type: 'select', value: settings['temperature'], options: ['0.3', '0.5', '0.7', '1.0'] },
        { id: 'streaming', label: 'Streaming', description: 'Stream AI responses', type: 'toggle', value: settings['streaming'] },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        { id: 'alerts', label: 'Alerts', description: 'Show system alerts', type: 'toggle', value: settings['alerts'] },
        { id: 'sounds', label: 'Sounds', description: 'Play notification sounds', type: 'toggle', value: settings['sounds'] },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: Shield,
      items: [
        { id: 'telemetry', label: 'Telemetry', description: 'Send usage data', type: 'toggle', value: settings['telemetry'] },
        { id: 'local-storage', label: 'Local Storage', description: 'Store data locally', type: 'toggle', value: settings['local-storage'] },
      ],
    },
    {
      id: 'data',
      title: 'Data',
      icon: Database,
      items: [
        { id: 'clear-cache', label: 'Clear Cache', description: 'Clear application cache', type: 'action' },
        { id: 'export-data', label: 'Export Data', description: 'Export your data', type: 'action' },
        { id: 'reset-settings', label: 'Reset Settings', description: 'Reset to default settings', type: 'action' },
      ],
    },
  ];

  // Update setting
  const updateSetting = (id: string, value: any) => {
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  // Apply theme to root
  useEffect(() => {
    // Apply theme styles
    if (theme === 'light') {
      document.documentElement.style.setProperty('--bg-elevated-0', '#FFFFFF');
      document.documentElement.style.setProperty('--bg-elevated-1', '#F3F4F6');
      document.documentElement.style.setProperty('--bg-elevated-2', '#E5E7EB');
      document.documentElement.style.setProperty('--bg-elevated-3', '#D1D5DB');
      document.documentElement.style.setProperty('--text-primary', '#111827');
      document.documentElement.style.setProperty('--text-secondary', '#374151');
      document.documentElement.style.setProperty('--text-muted', '#6B7280');
      document.documentElement.style.setProperty('--border-default', '#E5E7EB');
    } else {
      // Default dark (VS Code style)
      document.documentElement.style.setProperty('--bg-elevated-0', '#1E1E1E');
      document.documentElement.style.setProperty('--bg-elevated-1', '#252526');
      document.documentElement.style.setProperty('--bg-elevated-2', '#2D2D2D');
      document.documentElement.style.setProperty('--bg-elevated-3', '#3C3C3C');
      document.documentElement.style.setProperty('--text-primary', '#CCCCCC');
      document.documentElement.style.setProperty('--text-secondary', '#9CDCFE');
      document.documentElement.style.setProperty('--text-muted', '#808080');
      document.documentElement.style.setProperty('--border-default', '#3C3C3C');
    }
  }, [theme]);

  return (
    <div className="flex flex-col h-full bg-bg-elevated-2 border-r border-border-default overflow-hidden">
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {sections.map((section) => (
          <div key={section.id} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <section.icon size={18} className="text-accent-primary" />
              <h3 className="text-sm font-semibold text-text-primary">{section.title}</h3>
            </div>
            
            <div className="space-y-2">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-bg-elevated-1 border border-border-default rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-text-primary">{item.label}</h4>
                      {item.description && (
                        <p className="text-xs text-text-secondary mt-1">{item.description}</p>
                      )}
                    </div>

                    {item.type === 'toggle' && (
                      <button
                        onClick={() => {
                          const newValue = !settings[item.id];
                          updateSetting(item.id, newValue);
                          if (item.id === 'word-wrap') setWordWrap(newValue);
                          if (item.id === 'animations') setAnimations(newValue);
                        }}
                        className={cn(
                          "relative w-9 h-5 rounded-full transition-colors mt-0.5",
                          settings[item.id] ? "bg-accent-primary" : "bg-bg-elevated-3"
                        )}
                      >
                        <motion.div
                          animate={{ x: settings[item.id] ? 18 : 2 }}
                          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    )}

                    {item.type === 'select' && (
                      <select
                        value={settings[item.id]}
                        onChange={(e) => {
                          updateSetting(item.id, e.target.value);
                          if (item.id === 'theme') setTheme(e.target.value.toLowerCase() as any);
                          if (item.id === 'font-size') setFontSize(parseInt(e.target.value));
                        }}
                        className="px-2 py-1 bg-bg-elevated-3 border border-border-default rounded text-xs text-text-primary focus:border-accent-primary outline-none"
                      >
                        {item.options?.map((option) => (
                          <option key={option} value={option.toLowerCase()}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}

                    {item.type === 'action' && (
                      <button className="flex items-center gap-1 text-xs text-accent-primary hover:text-accent-primary-hover transition-colors">
                        {item.label}
                        <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

