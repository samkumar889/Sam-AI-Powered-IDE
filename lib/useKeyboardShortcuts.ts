'use client';

import { useEffect } from 'react';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey === undefined || e.ctrlKey === shortcut.ctrlKey;
        const shiftMatch = shortcut.shiftKey === undefined || e.shiftKey === shortcut.shiftKey;
        const altMatch = shortcut.altKey === undefined || e.altKey === shortcut.altKey;
        const metaMatch = shortcut.metaKey === undefined || e.metaKey === shortcut.metaKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          e.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export const commonShortcuts = {
  commandPalette: { key: 'p', ctrlKey: true, shiftKey: true },
  save: { key: 's', ctrlKey: true },
  openFile: { key: 'o', ctrlKey: true },
  newFile: { key: 'n', ctrlKey: true },
  find: { key: 'f', ctrlKey: true },
  replace: { key: 'h', ctrlKey: true },
  goToLine: { key: 'g', ctrlKey: true },
  toggleSidebar: { key: 'b', ctrlKey: true },
  toggleTerminal: { key: '`', ctrlKey: true },
  closeTab: { key: 'w', ctrlKey: true },
  nextTab: { key: 'Tab', ctrlKey: true },
  prevTab: { key: 'Tab', ctrlKey: true, shiftKey: true },
};
