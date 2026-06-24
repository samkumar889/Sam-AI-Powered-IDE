import { describe, it, expect } from 'vitest';
import { cn, formatDate, getFileIcon } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('p-4', 'bg-red-500', 'text-white')).toBe('p-4 bg-red-500 text-white');
    });
    
    it('handles conflicts with tailwind-merge', () => {
      expect(cn('p-4', 'p-6')).toBe('p-6');
    });
  });

  describe('getFileIcon', () => {
    it('returns correct icon for JavaScript files', () => {
      expect(getFileIcon('test.js')).toBe('javascript');
      expect(getFileIcon('test.tsx')).toBe('javascript');
    });
    
    it('returns correct icon for HTML files', () => {
      expect(getFileIcon('index.html')).toBe('html');
    });
    
    it('returns "file" for unknown extensions', () => {
      expect(getFileIcon('unknown.xyz')).toBe('file');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const formatted = formatDate(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('1');
    });
  });
});
