'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  File, 
  Edit, 
  Search as SearchIcon, 
  View, 
  ArrowRight, 
  Play, 
  Terminal, 
  HelpCircle,
  ChevronDown,
  X,
  Sparkles,
  Settings,
  User,
  Upload,
  FolderOpen,
  Save,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

interface MenuItem {
  label: string;
  icon: any;
  items?: string[];
  actions?: Record<string, () => void>;
}

export default function TopMenuBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { openFolder, createFile, createFileOnDisk, deleteFile, renameFile, saveFileToDisk } = useAppStore();

  const handleOpenFolder = async () => {
    await openFolder();
    setActiveMenu(null);
  };

  const handleNewFile = async () => {
    const name = prompt('Enter file name:');
    if (name) {
      createFile(null, name, 'file', '');
      setActiveMenu(null);
    }
  };

  const handleNewFolder = async () => {
    const name = prompt('Enter folder name:');
    if (name) {
      createFile(null, name, 'folder');
      setActiveMenu(null);
    }
  };

  const handleSave = async () => {
    // Save current file
    setActiveMenu(null);
  };

  const handleDeploy = () => {
    window.open('https://vercel.com/new', '_blank');
    setActiveMenu(null);
  };

  const menuItems: MenuItem[] = [
    { 
      label: 'File', 
      icon: File, 
      items: ['New File', 'New Folder', 'Open File...', 'Open Folder...', 'Save', 'Save As...', 'Close', '-', 'Deploy to Vercel'],
      actions: {
        'New File': handleNewFile,
        'New Folder': handleNewFolder,
        'Open Folder...': handleOpenFolder,
        'Save': handleSave,
        'Deploy to Vercel': handleDeploy,
      }
    },
    { label: 'Edit', icon: Edit, items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Find', 'Replace'] },
    { label: 'Selection', icon: null, items: ['Select All', 'Expand Selection', 'Shrink Selection'] },
    { label: 'View', icon: View, items: ['Command Palette', 'Explorer', 'Search', 'Source Control', 'Extensions'] },
    { label: 'Go', icon: ArrowRight, items: ['Go to File...', 'Go to Line...', 'Go to Symbol...', 'Go to Definition'] },
    { label: 'Run', icon: Play, items: ['Run Task', 'Debug', 'Stop'] },
    { label: 'Terminal', icon: Terminal, items: ['New Terminal', 'Split Terminal', 'Clear'] },
    { label: 'Help', icon: HelpCircle, items: ['Documentation', 'Keyboard Shortcuts', 'About'] },
  ];

  const handleMenuClick = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  const handleCommandPalette = () => {
    setCommandPaletteOpen(true);
    setActiveMenu(null);
  };

  const handleMenuItemClick = (item: string, menuItem: MenuItem) => {
    if (item === '-') return;
    
    if (menuItem.actions && menuItem.actions[item]) {
      menuItem.actions[item]();
    } else if (item === 'Command Palette') {
      handleCommandPalette();
    }
    setActiveMenu(null);
  };

  return (
    <>
      <div className="h-8 bg-sidebar border-b border-border flex items-center px-2 select-none">
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 py-1 mr-4">
          <Sparkles className="text-accent" size={14} />
          <span className="text-sm font-semibold text-text-primary">SAM AI</span>
        </div>

        {/* Menu Items */}
        <div className="flex items-center gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.label;
            
            return (
              <div key={item.label} className="relative">
                <button
                  onClick={() => handleMenuClick(item.label)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded text-sm transition-colors",
                    isActive 
                      ? "bg-sidebar-active text-text-primary" 
                      : "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover"
                  )}
                >
                  {Icon && <Icon size={14} />}
                  <span>{item.label}</span>
                  {item.items && <ChevronDown size={10} className="ml-0.5" />}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isActive && item.items && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setActiveMenu(null)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-48 bg-sidebar border border-border rounded-lg shadow-glass z-50 overflow-hidden"
                      >
                        {item.items.map((subItem) => (
                          subItem === '-' ? (
                            <div key={subItem} className="h-px bg-border my-1" />
                          ) : (
                            <button
                              key={subItem}
                              className={cn(
                                "w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2",
                                subItem === 'Deploy to Vercel' 
                                  ? "text-accent hover:text-accent-light hover:bg-sidebar-hover" 
                                  : "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover"
                              )}
                              onClick={() => handleMenuItemClick(subItem, item)}
                            >
                              {subItem === 'Deploy to Vercel' && <Rocket size={14} />}
                              {subItem === 'Open Folder...' && <FolderOpen size={14} />}
                              {subItem === 'Save' && <Save size={14} />}
                              {subItem}
                            </button>
                          )
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleDeploy}
            className="flex items-center gap-2 px-3 py-1 text-sm text-accent hover:text-accent-light hover:bg-sidebar-hover rounded transition-colors"
          >
            <Rocket size={14} />
            <span>Deploy</span>
          </button>

          <button
            onClick={handleCommandPalette}
            className="flex items-center gap-2 px-3 py-1 text-sm text-text-secondary hover:text-text-primary hover:bg-sidebar-hover rounded transition-colors"
          >
            <SearchIcon size={14} />
            <span>Search</span>
            <span className="text-xs text-text-muted px-1.5 py-0.5 bg-panel rounded">Ctrl+Shift+P</span>
          </button>

          <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-sidebar-hover rounded transition-colors">
            <Settings size={16} />
          </button>

          <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-sidebar-hover rounded transition-colors">
            <User size={16} />
          </button>
        </div>
      </div>

      {/* Command Palette */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setCommandPaletteOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] bg-sidebar border border-border rounded-lg shadow-glass z-50"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <SearchIcon size={18} className="text-text-muted" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm"
                  autoFocus
                />
                <button
                  onClick={() => setCommandPaletteOpen(false)}
                  className="p-1 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="max-h-80 overflow-y-auto p-2">
                <div className="px-2 py-1.5 text-xs text-text-muted font-medium">Recent Commands</div>
                {['New File', 'Open Folder...', 'Toggle Sidebar', 'Format Document'].map((cmd) => (
                  <button
                    key={cmd}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-sidebar-hover rounded transition-colors"
                  >
                    <Sparkles size={14} className="text-accent" />
                    <span>{cmd}</span>
                  </button>
                ))}
              </div>
              
              <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-panel rounded">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-panel rounded">Enter</kbd> Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-panel rounded">Esc</kbd> Close
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
