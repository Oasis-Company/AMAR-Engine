import React, { useState, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  size?: number;
  modified?: Date;
  children?: FileItem[];
  tags?: string[];
}

const FileExplorer: React.FC = () => {
  const { t } = useTranslation();
  const [currentPath, setCurrentPath] = useState<string>('');
  const [fileTree, setFileTree] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [showDevices, setShowDevices] = useState(false);
  const [devices, setDevices] = useState<FileItem[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [groupBy, setGroupBy] = useState<'none' | 'type'>('none');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [navHistory, setNavHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // 文件操作相关状态
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<{ items: string[]; action: 'copy' | 'cut' } | null>(null);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameItem, setRenameItem] = useState<FileItem | null>(null);
  const [newName, setNewName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteItems, setDeleteItems] = useState<string[]>([]);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuTarget, setContextMenuTarget] = useState<FileItem | null>(null);
  
  // 进度指示相关状态
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);
  
  // 文件预览相关状态
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<FileItem | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [previewError, setPreviewError] = useState<string>('');
  
  // 通知系统状态
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  // 文件详情面板状态
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [detailsItem, setDetailsItem] = useState<FileItem | null>(null);

  // 最近文件状态
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);
  const [showRecentFiles, setShowRecentFiles] = useState(false);

  // 批量操作状态
  const [showBatchRenameDialog, setShowBatchRenameDialog] = useState(false);
  const [batchRenamePrefix, setBatchRenamePrefix] = useState('');
  const [batchRenameSuffix, setBatchRenameSuffix] = useState('');
  const [batchRenameStartIndex, setBatchRenameStartIndex] = useState(1);
  const [showBatchMoveDialog, setShowBatchMoveDialog] = useState(false);
  const [batchMoveTarget, setBatchMoveTarget] = useState('');

  // 文件内容搜索状态
  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [contentSearchResults, setContentSearchResults] = useState<{ item: FileItem; matches: number; preview: string }[]>([]);
  const [isContentSearching, setIsContentSearching] = useState(false);

  // 文件大小计算状态
  const [folderSizes, setFolderSizes] = useState<{ [key: string]: number }>({});
  const [isCalculatingSize, setIsCalculatingSize] = useState(false);
  const [currentCalculatingFolder, setCurrentCalculatingFolder] = useState('');

  // 性能分析状态
  const [performanceMetrics, setPerformanceMetrics] = useState({
    lastOperationTime: 0,
    averageOperationTime: 0,
    operationCount: 0,
    fileCount: 0,
    folderCount: 0,
    largestFileSize: 0,
    largestFolderSize: 0,
    optimizationTips: [] as string[]
  });
  const [showPerformancePanel, setShowPerformancePanel] = useState(false);

  // 文件菜单状态
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [fileMenuPosition, setFileMenuPosition] = useState({ x: 0, y: 0 });

  // 文件标签状态
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAddTagDialog, setShowAddTagDialog] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [showEditTagsDialog, setShowEditTagsDialog] = useState(false);
  const [editTagsItem, setEditTagsItem] = useState<FileItem | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 搜索配置状态
  const [searchCaseSensitive, setSearchCaseSensitive] = useState(false);
  const [isRegexSearch, setIsRegexSearch] = useState(false);
  const [searchFileTypes, setSearchFileTypes] = useState<string[]>([]);

  // 键盘快捷键状态
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // 虚拟滚动相关状态
  const [visibleItems, setVisibleItems] = useState<FileItem[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(20); // 默认显示20个项目
  const listRef = useRef<HTMLDivElement>(null);
  const itemHeight = 48; // 每个项目的高度（像素）

  const openFolder = () => {
    // 使用系统文件选择对话框
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    (input as any).directory = true;
    input.multiple = false;
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const selectedFile = target.files[0];
        // 由于浏览器安全限制，无法直接获取文件路径
        // 使用模拟路径作为示例
        const folderPath = `C:\\SelectedFolder`;
        browseFolder(folderPath);
      }
    };
    
    input.click();
  };

  const browseDevice = (devicePath: string) => {
    setLoading(true);
    setTimeout(() => {
      // 模拟设备根目录下的文件夹
      const mockFileTree: FileItem[] = [
        {
          id: `dir-${Date.now()}-1`,
          name: 'Users',
          type: 'directory',
          path: `${devicePath}\\Users`,
          modified: new Date()
        },
        {
          id: `dir-${Date.now()}-2`,
          name: 'Program Files',
          type: 'directory',
          path: `${devicePath}\\Program Files`,
          modified: new Date()
        },
        {
          id: `dir-${Date.now()}-3`,
          name: 'Program Files (x86)',
          type: 'directory',
          path: `${devicePath}\\Program Files (x86)`,
          modified: new Date()
        },
        {
          id: `dir-${Date.now()}-4`,
          name: 'Windows',
          type: 'directory',
          path: `${devicePath}\\Windows`,
          modified: new Date()
        }
      ];
      setCurrentPath(devicePath);
      setFileTree(mockFileTree);
      setShowDevices(false);
      
      // 添加到导航历史
      setNavHistory(prev => [...prev.slice(0, historyIndex + 1), devicePath]);
      setHistoryIndex(prev => prev + 1);
      
      setLoading(false);
    }, 500);
  };

  const browseFolder = (folderPath: string) => {
    setLoading(true);
    setTimeout(() => {
      // 模拟文件夹下的内容
      const mockFileTree: FileItem[] = [
        {
          id: `dir-${Date.now()}-1`,
          name: 'Documents',
          type: 'directory',
          path: `${folderPath}\\Documents`,
          modified: new Date()
        },
        {
          id: `dir-${Date.now()}-2`,
          name: 'Downloads',
          type: 'directory',
          path: `${folderPath}\\Downloads`,
          modified: new Date()
        },
        {
          id: `dir-${Date.now()}-3`,
          name: 'Desktop',
          type: 'directory',
          path: `${folderPath}\\Desktop`,
          modified: new Date()
        },
        {
          id: `file-${Date.now()}-1`,
          name: 'example.txt',
          type: 'file',
          path: `${folderPath}\\example.txt`,
          size: 1024,
          modified: new Date()
        },
        {
          id: `file-${Date.now()}-2`,
          name: 'image.png',
          type: 'file',
          path: `${folderPath}\\image.png`,
          size: 1024000,
          modified: new Date()
        },
        {
          id: `file-${Date.now()}-3`,
          name: 'document.pdf',
          type: 'file',
          path: `${folderPath}\\document.pdf`,
          size: 512000,
          modified: new Date()
        }
      ];
      setCurrentPath(folderPath);
      setFileTree(mockFileTree);
      
      // 添加到导航历史
      setNavHistory(prev => [...prev.slice(0, historyIndex + 1), folderPath]);
      setHistoryIndex(prev => prev + 1);
      
      setLoading(false);
    }, 500);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousPath = navHistory[newIndex];
      setCurrentPath(previousPath);
      
      // 模拟加载前一个路径的内容
      setLoading(true);
      setTimeout(() => {
        // 模拟文件夹内容
        const mockFileTree: FileItem[] = [
          {
            id: `dir-${Date.now()}-1`,
            name: 'Documents',
            type: 'directory',
            path: `${previousPath}\\Documents`,
            modified: new Date()
          },
          {
            id: `file-${Date.now()}-1`,
            name: 'example.txt',
            type: 'file',
            path: `${previousPath}\\example.txt`,
            size: 1024,
            modified: new Date()
          }
        ];
        setFileTree(mockFileTree);
        setHistoryIndex(newIndex);
        setLoading(false);
      }, 300);
    }
  };

  const goForward = () => {
    if (historyIndex < navHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const nextPath = navHistory[newIndex];
      setCurrentPath(nextPath);
      
      // 模拟加载下一个路径的内容
      setLoading(true);
      setTimeout(() => {
        // 模拟文件夹内容
        const mockFileTree: FileItem[] = [
          {
            id: `dir-${Date.now()}-1`,
            name: 'Subfolder',
            type: 'directory',
            path: `${nextPath}\\Subfolder`,
            modified: new Date()
          },
          {
            id: `file-${Date.now()}-1`,
            name: 'subfile.txt',
            type: 'file',
            path: `${nextPath}\\subfile.txt`,
            size: 512,
            modified: new Date()
          }
        ];
        setFileTree(mockFileTree);
        setHistoryIndex(newIndex);
        setLoading(false);
      }, 300);
    }
  };

  const toggleFavorite = () => {
    if (currentPath) {
      setFavorites(prev => {
        if (prev.includes(currentPath)) {
          return prev.filter(path => path !== currentPath);
        } else {
          return [...prev, currentPath];
        }
      });
    }
  };

  // 选择文件/文件夹
  const handleItemSelect = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (event.ctrlKey || event.metaKey) {
      // 多选模式
      setSelectedItems(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId);
        } else {
          return [...prev, itemId];
        }
      });
    } else if (event.shiftKey && selectedItems.length > 0) {
      // 范围选择
      const sortedItems = [...fileTree].sort((a, b) => a.name.localeCompare(b.name));
      const startIndex = sortedItems.findIndex(item => item.id === selectedItems[selectedItems.length - 1]);
      const endIndex = sortedItems.findIndex(item => item.id === itemId);
      
      if (startIndex !== -1 && endIndex !== -1) {
        const start = Math.min(startIndex, endIndex);
        const end = Math.max(startIndex, endIndex);
        const rangeItems = sortedItems.slice(start, end + 1).map(item => item.id);
        setSelectedItems(rangeItems);
      }
    } else {
      // 单选模式
      setSelectedItems([itemId]);
    }
  };

  // 打开重命名对话框
  const openRenameDialog = (item: FileItem) => {
    setRenameItem(item);
    setNewName(item.name);
    setShowRenameDialog(true);
  };

  // 执行重命名
  const handleRename = () => {
    if (renameItem && newName.trim() && newName !== renameItem.name) {
      simulateOperationWithProgress('Renaming item');
      setLoading(true);
      setTimeout(() => {
        try {
          const updatedFileTree = fileTree.map(item => {
            if (item.id === renameItem.id) {
              return {
                ...item,
                name: newName.trim(),
                path: item.path.replace(/[^\\]+$/, newName.trim())
              };
            }
            return item;
          });
          setFileTree(updatedFileTree);
          setShowRenameDialog(false);
          setRenameItem(null);
          setNewName('');
          setLoading(false);
          addNotification(`Successfully renamed "${renameItem.name}" to "${newName.trim()}"`, 'success');
        } catch (error) {
          setLoading(false);
          addNotification('Failed to rename file', 'error');
        }
      }, 1000);
    }
  };

  // 打开删除对话框
  const openDeleteDialog = (items: string[]) => {
    setDeleteItems(items);
    setShowDeleteDialog(true);
  };

  // 执行删除
  const handleDelete = () => {
    if (deleteItems.length > 0) {
      simulateOperationWithProgress('Deleting items');
      setLoading(true);
      setTimeout(() => {
        try {
          const updatedFileTree = fileTree.filter(item => !deleteItems.includes(item.id));
          setFileTree(updatedFileTree);
          setShowDeleteDialog(false);
          setDeleteItems([]);
          setSelectedItems(prev => prev.filter(id => !deleteItems.includes(id)));
          setLoading(false);
          addNotification(`Successfully deleted ${deleteItems.length} item${deleteItems.length > 1 ? 's' : ''}`, 'success');
        } catch (error) {
          setLoading(false);
          addNotification('Failed to delete items', 'error');
        }
      }, 1000);
    }
  };

  // 复制文件/文件夹
  const handleCopy = () => {
    if (selectedItems.length > 0) {
      simulateOperationWithProgress('Copying items');
      setTimeout(() => {
        setClipboard({ items: selectedItems, action: 'copy' });
        addNotification(`Copied ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} to clipboard`, 'success');
      }, 1000);
    }
  };

  // 剪切文件/文件夹
  const handleCut = () => {
    if (selectedItems.length > 0) {
      simulateOperationWithProgress('Cutting items');
      setTimeout(() => {
        setClipboard({ items: selectedItems, action: 'cut' });
      }, 1000);
    }
  };

  // 粘贴文件/文件夹
  const handlePaste = () => {
    if (clipboard && currentPath) {
      simulateOperationWithProgress('Pasting items');
      setLoading(true);
      setTimeout(() => {
        const itemsToPaste = fileTree.filter(item => clipboard.items.includes(item.id));
        const newItems = itemsToPaste.map(item => {
          const newPath = `${currentPath}\\${item.name}`;
          return {
            ...item,
            id: `pasted-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            path: newPath
          };
        });
        
        let updatedFileTree = [...fileTree];
        
        if (clipboard.action === 'cut') {
          // 如果是剪切，移除原文件
          updatedFileTree = updatedFileTree.filter(item => !clipboard.items.includes(item.id));
        }
        
        // 添加新文件
        updatedFileTree = [...updatedFileTree, ...newItems];
        setFileTree(updatedFileTree);
        setClipboard(null);
        setLoading(false);
      }, 1000);
    }
  };

  // 处理上下文菜单
  const handleContextMenu = (e: React.MouseEvent, item: FileItem | null) => {
    e.preventDefault();
    setContextMenuTarget(item);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
    
    // 如果点击了具体项目，选择它
    if (item) {
      setSelectedItems([item.id]);
    }
  };

  // 关闭上下文菜单
  const closeContextMenu = () => {
    setShowContextMenu(false);
    setContextMenuTarget(null);
  };

  // 处理文件预览
  const handlePreview = (item: FileItem) => {
    setPreviewItem(item);
    setPreviewError('');
    setShowPreview(true);
    
    // 添加到最近文件
    addToRecentFiles(item);
    
    // 根据文件类型生成预览
    const extension = item.name.split('.').pop()?.toLowerCase();
    
    if (item.type === 'directory') {
      setPreviewContent(`Folder: ${item.name}`);
    } else if (['txt', 'js', 'ts', 'jsx', 'tsx', 'json', 'md', 'html', 'css', 'scss', 'less', 'py', 'java', 'c', 'cpp', 'cs', 'go', 'rust', 'php', 'rb', 'swift', 'kotlin'].includes(extension || '')) {
      // 代码文件预览（添加语法高亮提示）
      setPreviewContent(`// Preview of ${item.name}\n\n\`\`\`${extension}\nThis is a simulated preview of the file content.\n\nIn a real application, this would display the actual file content\nwith syntax highlighting.\n\`\`\`\n\nFile size: ${item.size ? formatFileSize(item.size) : 'Unknown'}\nLast modified: ${item.modified ? item.modified.toLocaleString() : 'Unknown'}`);
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg'].includes(extension || '')) {
      // 图片文件预览
      setPreviewContent(`<img src="https://via.placeholder.com/600x400?text=${encodeURIComponent(item.name)}" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px;" />`);
    } else if (['pdf'].includes(extension || '')) {
      // PDF文件预览
      setPreviewContent(`<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #888; gap: 20px;"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><h3>PDF Document</h3><p>${item.name}</p><p>File size: ${item.size ? formatFileSize(item.size) : 'Unknown'}</p></div>`);
    } else if (['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'].includes(extension || '')) {
      // 视频文件预览
      setPreviewContent(`<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #888; gap: 20px;"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 8L16 12L10 16V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><h3>Video File</h3><p>${item.name}</p><p>File size: ${item.size ? formatFileSize(item.size) : 'Unknown'}</p></div>`);
    } else if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'wma', 'm4a'].includes(extension || '')) {
      // 音频文件预览
      setPreviewContent(`<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #888; gap: 20px;"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18V5L21 12L9 19V18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><h3>Audio File</h3><p>${item.name}</p><p>File size: ${item.size ? formatFileSize(item.size) : 'Unknown'}</p></div>`);
    } else if (['csv', 'xls', 'xlsx', 'ods'].includes(extension || '')) {
      // 表格文件预览
      setPreviewContent(`<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #888; gap: 20px;"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><h3>Spreadsheet File</h3><p>${item.name}</p><p>File size: ${item.size ? formatFileSize(item.size) : 'Unknown'}</p></div>`);
    } else if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension || '')) {
      // 压缩文件预览
      setPreviewContent(`<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #888; gap: 20px;"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.27 6.96L12 12.01l8.73-5.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><h3>Compressed File</h3><p>${item.name}</p><p>File size: ${item.size ? formatFileSize(item.size) : 'Unknown'}</p></div>`);
    } else if (['psd', 'ai', 'xd', 'sketch'].includes(extension || '')) {
      // 设计文件预览
      setPreviewContent(`<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #888; gap: 20px;"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><h3>Design File</h3><p>${item.name}</p><p>File size: ${item.size ? formatFileSize(item.size) : 'Unknown'}</p></div>`);
    } else if (['exe', 'dll', 'bin', 'app', 'dmg', 'pkg'].includes(extension || '')) {
      // 可执行文件预览
      setPreviewContent(`<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #888; gap: 20px;"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><h3>Executable File</h3><p>${item.name}</p><p>File size: ${item.size ? formatFileSize(item.size) : 'Unknown'}</p></div>`);
    } else {
      // 不支持预览的文件类型
      setPreviewContent(`<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #888; gap: 20px;"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><h3>File</h3><p>${item.name}</p><p>File size: ${item.size ? formatFileSize(item.size) : 'Unknown'}</p><p>Type: ${extension ? extension.toUpperCase() : 'Unknown'}</p></div>`);
    }
  };

  // 关闭文件预览
  const closePreview = () => {
    setShowPreview(false);
    setPreviewItem(null);
    setPreviewContent('');
    setPreviewError('');
  };

  // 处理文件详情面板
  const handleShowDetails = (item: FileItem) => {
    setDetailsItem(item);
    setShowDetailsPanel(true);
  };

  // 关闭文件详情面板
  const closeDetailsPanel = () => {
    setShowDetailsPanel(false);
    setDetailsItem(null);
  };

  // 最近文件处理函数
  const addToRecentFiles = (item: FileItem) => {
    if (item.type === 'file') {
      setRecentFiles(prev => {
        // 移除已存在的相同文件
        const filtered = prev.filter(file => file.path !== item.path);
        // 添加到开头
        const updated = [item, ...filtered];
        // 限制最近文件数量为10个
        return updated.slice(0, 10);
      });
    }
  };

  // 打开最近文件
  const openRecentFile = (item: FileItem) => {
    // 模拟打开文件
    setCurrentPath(item.path.substring(0, item.path.lastIndexOf('\\')));
    setShowRecentFiles(false);
  };

  // 清除最近文件
  const clearRecentFiles = () => {
    setRecentFiles([]);
    setShowRecentFiles(false);
  };

  // 批量操作相关函数
  const handleBatchRename = () => {
    if (selectedItems.length > 0) {
      simulateOperationWithProgress('Batch renaming items');
      setLoading(true);
      setTimeout(() => {
        try {
          let index = batchRenameStartIndex;
          const updatedFileTree = fileTree.map(item => {
            if (selectedItems.includes(item.id)) {
              const extension = item.name.split('.').pop();
              const nameWithoutExtension = item.name.substring(0, item.name.lastIndexOf('.'));
              const newName = `${batchRenamePrefix}${index++}${batchRenameSuffix}${extension ? `.${extension}` : ''}`;
              return {
                ...item,
                name: newName,
                path: item.path.replace(/[^\\]+$/, newName)
              };
            }
            return item;
          });
          setFileTree(updatedFileTree);
          setShowBatchRenameDialog(false);
          setBatchRenamePrefix('');
          setBatchRenameSuffix('');
          setBatchRenameStartIndex(1);
          setLoading(false);
          addNotification(`Successfully renamed ${selectedItems.length} items`, 'success');
        } catch (error) {
          setLoading(false);
          addNotification('Failed to batch rename files', 'error');
        }
      }, 1000);
    }
  };

  const handleBatchMove = () => {
    if (selectedItems.length > 0 && batchMoveTarget) {
      simulateOperationWithProgress('Batch moving items');
      setLoading(true);
      setTimeout(() => {
        try {
          const updatedFileTree = fileTree.map(item => {
            if (selectedItems.includes(item.id)) {
              const newPath = `${batchMoveTarget}\\${item.name}`;
              return {
                ...item,
                path: newPath
              };
            }
            return item;
          });
          setFileTree(updatedFileTree);
          setShowBatchMoveDialog(false);
          setBatchMoveTarget('');
          setLoading(false);
          addNotification(`Successfully moved ${selectedItems.length} items`, 'success');
        } catch (error) {
          setLoading(false);
          addNotification('Failed to batch move files', 'error');
        }
      }, 1000);
    }
  };

  // 文件内容搜索函数
  const handleContentSearch = () => {
    if (contentSearchTerm.trim()) {
      setIsContentSearching(true);
      simulateOperationWithProgress('Searching file contents');
      
      setTimeout(() => {
        try {
          // 模拟文件内容搜索
          const results: { item: FileItem; matches: number; preview: string }[] = [];
          
          fileTree.forEach(item => {
            if (item.type === 'file') {
              // 只搜索文本文件
              const textExtensions = ['txt', 'js', 'ts', 'jsx', 'tsx', 'json', 'md', 'html', 'css', 'scss', 'less', 'py', 'java', 'c', 'cpp', 'cs', 'go', 'rust', 'php', 'rb', 'swift', 'kotlin'];
              const extension = item.name.split('.').pop()?.toLowerCase();
              
              if (extension && textExtensions.includes(extension)) {
                // 模拟搜索结果
                const matches = Math.floor(Math.random() * 5); // 随机生成匹配数量
                if (matches > 0) {
                  results.push({
                    item,
                    matches,
                    preview: `Sample content showing "${contentSearchTerm}" match...`
                  });
                }
              }
            }
          });
          
          setContentSearchResults(results);
          setIsContentSearching(false);
          addNotification(`Found ${results.length} files with content matches`, 'success');
        } catch (error) {
          setIsContentSearching(false);
          addNotification('Failed to search file contents', 'error');
        }
      }, 1500);
    }
  };

  // 文件夹大小计算函数
  const calculateFolderSize = (folderPath: string) => {
    setIsCalculatingSize(true);
    setCurrentCalculatingFolder(folderPath);
    simulateOperationWithProgress(`Calculating size for ${folderPath}`);
    
    setTimeout(() => {
      try {
        // 模拟文件夹大小计算
        let totalSize = 0;
        
        // 模拟遍历文件夹内容
        for (let i = 0; i < 100; i++) {
          // 随机生成文件大小
          totalSize += Math.floor(Math.random() * 1024 * 1024); // 最大1MB
        }
        
        // 更新文件夹大小
        setFolderSizes(prev => ({
          ...prev,
          [folderPath]: totalSize
        }));
        
        setIsCalculatingSize(false);
        setCurrentCalculatingFolder('');
        addNotification(`Calculated size for ${folderPath}: ${formatFileSize(totalSize)}`, 'success');
      } catch (error) {
        setIsCalculatingSize(false);
        setCurrentCalculatingFolder('');
        addNotification('Failed to calculate folder size', 'error');
      }
    }, 2000);
  };

  // 批量计算所有文件夹大小
  const calculateAllFoldersSize = () => {
    const startTime = performance.now();
    const folders = fileTree.filter(item => item.type === 'directory');
    
    folders.forEach(folder => {
      calculateFolderSize(folder.path);
    });
    
    const endTime = performance.now();
    recordOperationTime(endTime - startTime);
  };

  // 记录操作时间
  const recordOperationTime = (timeMs: number) => {
    setPerformanceMetrics(prev => {
      const newOperationCount = prev.operationCount + 1;
      const newAverageTime = (prev.averageOperationTime * prev.operationCount + timeMs) / newOperationCount;
      
      // 分析文件系统状态
      const fileCount = fileTree.filter(item => item.type === 'file').length;
      const folderCount = fileTree.filter(item => item.type === 'directory').length;
      const largestFile = fileTree.filter(item => item.type === 'file').reduce<FileItem | { size: number }>((max, item) => {
        return (item.size || 0) > (max.size || 0) ? item : max;
      }, { size: 0 });
      const largestFolderSize = Math.max(...Object.values({ ...folderSizes, 'prev': prev.largestFolderSize }));
      
      // 生成优化提示
      const optimizationTips: string[] = [];
      
      if (fileCount > 1000) {
        optimizationTips.push('Consider organizing large number of files into subfolders');
      }
      
      if ('name' in largestFile && largestFile.size && largestFile.size > 100 * 1024 * 1024) { // 100MB
        optimizationTips.push(`Large file detected: ${largestFile.name} (${formatFileSize(largestFile.size)})`);
      }
      
      if (newAverageTime > 500) {
        optimizationTips.push('Operations are taking longer than usual. Consider closing other applications.');
      }
      
      if (folderCount > 100) {
        optimizationTips.push('Many folders detected. Consider using favorites for frequently accessed locations.');
      }
      
      return {
        ...prev,
        lastOperationTime: timeMs,
        averageOperationTime: newAverageTime,
        operationCount: newOperationCount,
        fileCount,
        folderCount,
        largestFileSize: largestFile.size || 0,
        largestFolderSize,
        optimizationTips
      };
    });
  };

  // 分析性能并显示报告
  const analyzePerformance = () => {
    recordOperationTime(0); // 触发性能分析
    setShowPerformancePanel(true);
  };

  // 文件操作菜单处理函数
  const openFileMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setFileMenuPosition({ x: e.clientX, y: e.clientY });
    setShowFileMenu(true);
  };

  const closeFileMenu = () => {
    setShowFileMenu(false);
  };

  // 通知系统函数
  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // 3秒后自动移除通知
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // 全选功能
  const handleSelectAll = () => {
    if (selectedItems.length === sortedAndFilteredFiles.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedAndFilteredFiles.map(item => item.id));
    }
  };

  // 模拟文件操作进度
  const simulateOperationWithProgress = (operation: string, duration: number = 1000) => {
    setIsOperationInProgress(true);
    setShowProgress(true);
    setProgress(0);
    setProgressMessage(`Performing ${operation}...`);

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowProgress(false);
            setIsOperationInProgress(false);
            setProgress(0);
            setProgressMessage('');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, duration / 10);
  };

  // 文件标签相关函数
  const openAddTagDialog = () => {
    setNewTagName('');
    setShowAddTagDialog(true);
  };

  // 虚拟滚动相关函数
  const handleScroll = () => {
    if (listRef.current) {
      const scrollTop = listRef.current.scrollTop;
      const newStartIndex = Math.floor(scrollTop / itemHeight);
      const newEndIndex = Math.min(newStartIndex + 30, sortedAndFilteredFiles.length); // 额外渲染10个项目作为缓冲区
      
      setStartIndex(newStartIndex);
      setEndIndex(newEndIndex);
    }
  };

  // 排序和筛选文件
  const sortedAndFilteredFiles = useMemo(() => {
    let filtered = fileTree;
    
    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(item => {
        let fileName = item.name;
        let searchString = searchTerm;
        
        // 大小写敏感设置
        if (!searchCaseSensitive) {
          fileName = fileName.toLowerCase();
          searchString = searchString.toLowerCase();
        }
        
        // 正则表达式搜索
        if (isRegexSearch) {
          try {
            const regex = new RegExp(searchString);
            return regex.test(fileName);
          } catch {
            // 如果正则表达式无效，回退到普通搜索
            return fileName.includes(searchString);
          }
        } else {
          // 普通搜索
          return fileName.includes(searchString);
        }
      });
    }
    
    // 文件类型筛选
    if (searchFileTypes.length > 0) {
      filtered = filtered.filter(item => {
        if (item.type === 'directory') return true;
        const extension = item.name.split('.').pop()?.toLowerCase();
        return extension ? searchFileTypes.includes(extension) : false;
      });
    }
    
    // 标签筛选
    if (selectedTag) {
      filtered = filtered.filter(item => 
        item.tags?.includes(selectedTag)
      );
    }
    
    // 排序
    const sorted = [...filtered].sort((a, b) => {
      // 首先按类型排序（文件夹在前）
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      
      // 然后按选定的属性排序
      switch (sortBy) {
        case 'name':
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        case 'size':
          if (a.size === undefined || b.size === undefined) return 0;
          return sortOrder === 'asc' 
            ? a.size - b.size 
            : b.size - a.size;
        case 'modified':
          if (a.modified === undefined || b.modified === undefined) return 0;
          return sortOrder === 'asc' 
            ? a.modified.getTime() - b.modified.getTime() 
            : b.modified.getTime() - a.modified.getTime();
        case 'type':
          // 按文件类型排序（文件夹在前，然后按扩展名）
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
          }
          const extA = a.name.split('.').pop()?.toLowerCase() || '';
          const extB = b.name.split('.').pop()?.toLowerCase() || '';
          return sortOrder === 'asc' 
            ? extA.localeCompare(extB) 
            : extB.localeCompare(extA);
        default:
          return 0;
      }
    });
    
    // 分组
    if (groupBy === 'type') {
      const grouped: { [key: string]: FileItem[] } = {
        'folders': [],
        'files': []
      };
      
      sorted.forEach(item => {
        if (item.type === 'directory') {
          grouped.folders.push(item);
        } else {
          grouped.files.push(item);
        }
      });
      
      // 合并分组结果
      return [...grouped.folders, ...grouped.files];
    }
    
    return sorted;
  }, [fileTree, sortBy, sortOrder, searchTerm, groupBy, selectedTag, searchCaseSensitive, isRegexSearch, searchFileTypes]);

  // 计算可见项目
  useEffect(() => {
    setVisibleItems(sortedAndFilteredFiles.slice(startIndex, endIndex));
  }, [sortedAndFilteredFiles, startIndex, endIndex]);

  // 当文件列表变化时重置虚拟滚动
  useEffect(() => {
    setStartIndex(0);
    setEndIndex(Math.min(20, sortedAndFilteredFiles.length));
  }, [sortedAndFilteredFiles]);

  const openEditTagsDialog = (item: FileItem) => {
    setEditTagsItem(item);
    setSelectedTags(item.tags || []);
    setShowEditTagsDialog(true);
  };

  const handleAddTag = () => {
    if (newTagName.trim() && !tags.includes(newTagName.trim())) {
      setTags(prev => [...prev, newTagName.trim()]);
      setShowAddTagDialog(false);
      setNewTagName('');
    }
  };

  const handleEditTags = () => {
    if (editTagsItem) {
      simulateOperationWithProgress('Updating tags');
      setTimeout(() => {
        const updatedFileTree = fileTree.map(item => {
          if (item.id === editTagsItem.id) {
            return {
              ...item,
              tags: selectedTags
            };
          }
          return item;
        });
        setFileTree(updatedFileTree);
        setShowEditTagsDialog(false);
        setEditTagsItem(null);
        setSelectedTags([]);
      }, 1000);
    }
  };

  const toggleTagFilter = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  // 拖放相关函数
  const handleDragStart = (e: React.DragEvent, item: FileItem) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const draggedItem = fileTree.find(item => item.id === itemId);
    
    if (draggedItem) {
      // 模拟移动文件
      setLoading(true);
      setTimeout(() => {
        const updatedFileTree = fileTree.filter(item => item.id !== draggedItem.id);
        setFileTree(updatedFileTree);
        setSelectedItems(prev => prev.filter(id => id !== draggedItem.id));
        setLoading(false);
      }, 300);
    }
  };

  const createNewFolder = () => {
    if (newFolderName.trim()) {
      simulateOperationWithProgress('Creating folder');
      setLoading(true);
      setTimeout(() => {
        const newFolder: FileItem = {
          id: `folder-${Date.now()}`,
          name: newFolderName.trim(),
          type: 'directory',
          path: `${currentPath}\\${newFolderName.trim()}`
        };
        setFileTree(prev => [...prev, newFolder]);
        setShowNewFolderDialog(false);
        setNewFolderName('');
        setLoading(false);
      }, 1000);
    }
  };

  const refreshFileTree = () => {
    // 模拟刷新文件树
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string, name: string): React.ReactNode => {
    if (type === 'directory') {
      return (
        <svg width={viewMode === 'grid' ? 32 : 16} height={viewMode === 'grid' ? 32 : 16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 4H4C3.45 4 3 4.45 3 5V19C3 19.55 3.45 20 4 20H20C20.55 20 21 19.55 21 19V9C21 8.45 20.55 8 20 8H12M10 4V8H20M10 4L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    const extension = name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'ts':
      case 'tsx':
        return (
          <svg width={viewMode === 'grid' ? 32 : 16} height={viewMode === 'grid' ? 32 : 16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'js':
      case 'jsx':
        return (
          <svg width={viewMode === 'grid' ? 32 : 16} height={viewMode === 'grid' ? 32 : 16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'json':
        return (
          <svg width={viewMode === 'grid' ? 32 : 16} height={viewMode === 'grid' ? 32 : 16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C15.87 15 19 11.87 19 8C19 4.13 15.87 1 12 1C8.13 1 5 4.13 5 8C5 11.87 8.13 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15C12 15 15 21 15 21H9C9 21 12 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 6H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'md':
        return (
          <svg width={viewMode === 'grid' ? 32 : 16} height={viewMode === 'grid' ? 32 : 16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <svg width={viewMode === 'grid' ? 32 : 16} height={viewMode === 'grid' ? 32 : 16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'pdf':
        return (
          <svg width={viewMode === 'grid' ? 32 : 16} height={viewMode === 'grid' ? 32 : 16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width={viewMode === 'grid' ? 32 : 16} height={viewMode === 'grid' ? 32 : 16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };



  const renderFileItem = (item: FileItem) => {
    const isSelected = selectedItems.includes(item.id);
    
    if (viewMode === 'grid') {
      return (
        <GridFileItemContainer 
          key={item.id} 
          isSelected={isSelected}
          onClick={(e) => handleItemSelect(item.id, e)}
          onContextMenu={(e) => handleContextMenu(e, item)}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
        >
          <FileIconContainer>
            {getFileIcon(item.type, item.name)}
          </FileIconContainer>
          <FileNameContainer>
            <FileName>{item.name}</FileName>
            {item.tags && item.tags.length > 0 && (
              <FileTags>
                {item.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </FileTags>
            )}
            {item.size ? (
              <FileSize>{formatFileSize(item.size)}</FileSize>
            ) : item.type === 'directory' && folderSizes[item.path] ? (
              <FileSize>{formatFileSize(folderSizes[item.path])}</FileSize>
            ) : item.type === 'directory' && (
              <FileSize onClick={() => calculateFolderSize(item.path)} style={{ cursor: 'pointer', color: '#007acc' }}>
                Calculate Size
              </FileSize>
            )}
            {item.modified && (
              <FileModified>{item.modified.toLocaleDateString()}</FileModified>
            )}
          </FileNameContainer>
        </GridFileItemContainer>
      );
    }
    
    // 默认列表视图
    return (
      <FileItemContainer 
        key={item.id} 
        isSelected={isSelected}
        onClick={(e) => handleItemSelect(item.id, e)}
        onContextMenu={(e) => handleContextMenu(e, item)}
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
      >
        <FileIcon>{getFileIcon(item.type, item.name)}</FileIcon>
        <div style={{ flex: 1 }}>
          <FileName onClick={() => item.type === 'directory' && browseFolder(item.path)}>
            {item.name}
          </FileName>
          {item.tags && item.tags.length > 0 && (
            <FileTags>
              {item.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </FileTags>
          )}
        </div>
        {item.size ? (
          <FileSizeColumn>{formatFileSize(item.size)}</FileSizeColumn>
        ) : item.type === 'directory' && folderSizes[item.path] ? (
          <FileSizeColumn>{formatFileSize(folderSizes[item.path])}</FileSizeColumn>
        ) : item.type === 'directory' && (
          <FileSizeColumn onClick={() => calculateFolderSize(item.path)} style={{ cursor: 'pointer', color: '#007acc' }}>
            Calculate Size
          </FileSizeColumn>
        )}
        {item.modified && (
          <FileModifiedColumn>{item.modified.toLocaleString()}</FileModifiedColumn>
        )}
        <FileActions>
          {item.type === 'directory' && (
            <ActionButton onClick={() => browseFolder(item.path)} title="Open">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ActionButton>
          )}
          <ActionButton onClick={() => handlePreview(item)} title="Preview">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
          <ActionButton onClick={() => handleShowDetails(item)} title="Details">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
          <ActionButton onClick={() => openEditTagsDialog(item)} title="Edit Tags">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
          <ActionButton onClick={() => openRenameDialog(item)} title="Rename">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
          <ActionButton onClick={() => openDeleteDialog([item.id])} title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
        </FileActions>
      </FileItemContainer>
    );
  };

  const handleCreateNewFolder = (e: React.FormEvent) => {
    e.preventDefault();
    createNewFolder();
  };

  // 键盘快捷键处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 防止默认行为冲突
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    // 复制: Ctrl+C
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault();
      handleCopy();
    }

    // 剪切: Ctrl+X
    if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
      e.preventDefault();
      handleCut();
    }

    // 粘贴: Ctrl+V
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault();
      handlePaste();
    }

    // 新建文件夹: Ctrl+Shift+N
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
      e.preventDefault();
      setShowNewFolderDialog(true);
    }

    // 全选: Ctrl+A
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      handleSelectAll();
    }

    // 删除: Delete
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      if (selectedItems.length > 0) {
        openDeleteDialog(selectedItems);
      }
    }

    // 重命名: F2
    if (e.key === 'F2') {
      e.preventDefault();
      if (selectedItems.length === 1) {
        const selectedItem = fileTree.find(item => item.id === selectedItems[0]);
        if (selectedItem) {
          openRenameDialog(selectedItem);
        }
      }
    }

    // 向上一级: Backspace
    if (e.key === 'Backspace' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      if (currentPath) {
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf('\\'));
        if (parentPath) {
          browseFolder(parentPath);
        } else {
          // 如果已经是根目录，显示设备列表
          openFolder();
        }
      }
    }

    // 前进: Alt+Right
    if (e.altKey && e.key === 'ArrowRight') {
      e.preventDefault();
      goForward();
    }

    // 后退: Alt+Left
    if (e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      goBack();
    }

    // 显示/隐藏快捷键: ?
    if (e.key === '?' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setShowKeyboardShortcuts(true);
    }
  };

  // 快捷键列表
  const keyboardShortcuts = [
    { action: '复制', shortcut: 'Ctrl+C' },
    { action: '剪切', shortcut: 'Ctrl+X' },
    { action: '粘贴', shortcut: 'Ctrl+V' },
    { action: '新建文件夹', shortcut: 'Ctrl+Shift+N' },
    { action: '全选', shortcut: 'Ctrl+A' },
    { action: '删除', shortcut: 'Delete' },
    { action: '重命名', shortcut: 'F2' },
    { action: '向上一级', shortcut: 'Backspace' },
    { action: '前进', shortcut: 'Alt+Right' },
    { action: '后退', shortcut: 'Alt+Left' },
    { action: '显示快捷键', shortcut: 'Ctrl+?' },
    { action: '搜索', shortcut: 'Ctrl+F' },
  ];

  return (
    <Container onKeyDown={handleKeyDown} tabIndex={0}>
      <Header>
        <Title>File Browser</Title>
        <Actions>
          <ActionButton onClick={goBack} title="Go Back (Alt+Left)" disabled={historyIndex <= 0}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
          <ActionButton onClick={goForward} title="Go Forward (Alt+Right)" disabled={historyIndex >= navHistory.length - 1}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
          <ActionButton onClick={openFolder} title="Open Folder">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4H4C3.45 4 3 4.45 3 5V19C3 19.55 3.45 20 4 20H20C20.55 20 21 19.55 21 19V9C21 8.45 20.55 8 20 8H12M10 4V8H20M10 4L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Open
          </ActionButton>
          <ActionButton onClick={() => setShowNewFolderDialog(true)} title="New Folder (Ctrl+Shift+N)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New
          </ActionButton>
          <ActionButton onClick={handleCopy} title="Copy (Ctrl+C)" disabled={selectedItems.length === 0}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Copy
          </ActionButton>
          <ActionButton onClick={handleCut} title="Cut (Ctrl+X)" disabled={selectedItems.length === 0}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Cut
          </ActionButton>
          <ActionButton onClick={handlePaste} title="Paste (Ctrl+V)" disabled={!clipboard}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Paste
          </ActionButton>
          <ActionButton onClick={() => {/* 简化版本移除了文件操作菜单 */}} title="File Operations" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            File
          </ActionButton>
          <ActionButton onClick={refreshFileTree} title="Refresh">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12A9 9 0 1 1 11.64 3.03" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
          <ActionButton onClick={toggleFavorite} title={favorites.includes(currentPath) ? "Remove from Favorites" : "Add to Favorites"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={favorites.includes(currentPath) ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
          <ActionButton onClick={() => setShowKeyboardShortcuts(true)} title="Keyboard Shortcuts (Ctrl+?)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
          <ActionButton onClick={() => setShowRecentFiles(true)} title="Recent Files">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
        </Actions>
      </Header>
      
      {currentPath && (
        <PathBar>
          <Breadcrumb>
            {currentPath.split('\\').map((segment, index, array) => {
              const path = array.slice(0, index + 1).join('\\');
              return (
                <BreadcrumbItem key={index}>
                  {index > 0 && <BreadcrumbSeparator>\</BreadcrumbSeparator>}
                  <BreadcrumbLink 
                    onClick={() => index < array.length - 1 && browseFolder(path)}
                    isActive={index === array.length - 1}
                  >
                    {segment}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              );
            })}
          </Breadcrumb>
        </PathBar>
      )}
      
      <Toolbar>
        <SearchContainer>
          <SearchIcon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search files and folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <ClearSearchButton onClick={() => setSearchTerm('')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="m6 6 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ClearSearchButton>
          )}
        </SearchContainer>
        
        <ToolbarActions>
          <ActionButton onClick={handleSelectAll} title="Select All">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select All'}
          </ActionButton>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'size' | 'modified' | 'type')}
          >
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
            <option value="modified">Sort by Date Modified</option>
            <option value="type">Sort by Type</option>
          </Select>
          
          <ActionButton onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} title={sortOrder === 'asc' ? "Sort Descending" : "Sort Ascending"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m5 12 7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
          
          <ActionButton onClick={() => setViewMode('list')} title="List View" isActive={viewMode === 'list'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 6h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 18h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
          
          <ActionButton onClick={() => setViewMode('grid')} title="Grid View" isActive={viewMode === 'grid'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h7v7H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 3h7v7h-7V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14h7v7h-7v-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 14h7v7H3v-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ActionButton>
        </ToolbarActions>
      </Toolbar>
      
      {loading ? (
        <LoadingState>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12A9 9 0 1 1 11.64 3.03" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Text>Loading...</Text>
        </LoadingState>
      ) : (
        sortedAndFilteredFiles.length > 0 ? (
          viewMode === 'grid' ? (
            <GridFileListContainer
              ref={listRef}
              onScroll={handleScroll}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                position: 'relative',
                overflow: 'auto',
                height: 'calc(100vh - 300px)'
              }}
            >
              {groupBy === 'type' ? (
                <>
                  {sortedAndFilteredFiles.filter(item => item.type === 'directory').length > 0 && (
                    <GroupHeader>Folders ({sortedAndFilteredFiles.filter(item => item.type === 'directory').length})</GroupHeader>
                  )}
                  {visibleItems.filter(item => item.type === 'directory').map(item => renderFileItem(item))}
                  {sortedAndFilteredFiles.filter(item => item.type === 'file').length > 0 && (
                    <GroupHeader>Files ({sortedAndFilteredFiles.filter(item => item.type === 'file').length})</GroupHeader>
                  )}
                  {visibleItems.filter(item => item.type === 'file').map(item => renderFileItem(item))}
                </>
              ) : (
                visibleItems.map(item => renderFileItem(item))
              )}
            </GridFileListContainer>
          ) : (
            <FileListContainer
              ref={listRef}
              onScroll={handleScroll}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                position: 'relative',
                overflow: 'auto',
                height: 'calc(100vh - 300px)'
              }}
            >
              <TableHeader>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Size</TableHeaderCell>
                <TableHeaderCell>Date Modified</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableHeader>
              
              {/* 虚拟滚动容器 */}
              <VirtualListContainer
                style={{
                  height: `${sortedAndFilteredFiles.length * itemHeight}px`,
                  position: 'relative'
                }}
              >
                {groupBy === 'type' ? (
                  <>
                    {sortedAndFilteredFiles.filter(item => item.type === 'directory').length > 0 && (
                      <GroupHeader>Folders ({sortedAndFilteredFiles.filter(item => item.type === 'directory').length})</GroupHeader>
                    )}
                    {visibleItems.filter(item => item.type === 'directory').map(item => renderFileItem(item))}
                    {sortedAndFilteredFiles.filter(item => item.type === 'file').length > 0 && (
                      <GroupHeader>Files ({sortedAndFilteredFiles.filter(item => item.type === 'file').length})</GroupHeader>
                    )}
                    {visibleItems.filter(item => item.type === 'file').map(item => renderFileItem(item))}
                  </>
                ) : (
                  visibleItems.map(item => renderFileItem(item))
                )}
              </VirtualListContainer>
            </FileListContainer>
          )
        ) : (
          <EmptyState>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4H4C3.45 4 3 4.45 3 5V19C3 19.55 3.45 20 4 20H20C20.55 20 21 19.55 21 19V9C21 8.45 20.55 8 20 8H12M10 4V8H20M10 4L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <Text>{searchTerm ? 'No files found matching your search' : 'No folder opened'}</Text>
            <SubText>{searchTerm ? 'Try a different search term' : 'Click "Open" to select a folder'}</SubText>
          </EmptyState>
        )
      )}
      
      {showNewFolderDialog && (
        <NewFolderDialog>
          <DialogContent>
            <DialogTitle>New Folder</DialogTitle>
            <form onSubmit={handleCreateNewFolder}>
              <InputField>
                <label htmlFor="folderName">Folder Name:</label>
                <input
                  id="folderName"
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  autoFocus
                />
              </InputField>
              <DialogActions>
                <Button type="button" onClick={() => setShowNewFolderDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!newFolderName.trim()}>
                  Create
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </NewFolderDialog>
      )}
      

      
      {showRenameDialog && (
        <NewFolderDialog>
          <DialogContent>
            <DialogTitle>Rename</DialogTitle>
            <form onSubmit={(e) => { e.preventDefault(); handleRename(); }}>
              <InputField>
                <label htmlFor="newName">New Name:</label>
                <input
                  id="newName"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new name"
                  autoFocus
                />
              </InputField>
              <DialogActions>
                <Button type="button" onClick={() => {
                  setShowRenameDialog(false);
                  setRenameItem(null);
                  setNewName('');
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!newName.trim() || newName === renameItem?.name}>
                  Rename
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </NewFolderDialog>
      )}
      
      {showDeleteDialog && (
        <NewFolderDialog>
          <DialogContent>
            <DialogTitle>Delete</DialogTitle>
            <p style={{ color: '#e0e0e0', marginBottom: '20px' }}>
              Are you sure you want to delete {deleteItems.length} item{deleteItems.length > 1 ? 's' : ''}?
            </p>
            <DialogActions>
              <Button type="button" onClick={() => {
                setShowDeleteDialog(false);
                setDeleteItems([]);
              }}>
                Cancel
              </Button>
              <Button type="button" onClick={handleDelete} style={{ backgroundColor: '#e53935', borderColor: '#e53935' }}>
                Delete
              </Button>
            </DialogActions>
          </DialogContent>
        </NewFolderDialog>
      )}
      
      {showContextMenu && (
        <ContextMenu style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}>
          <ContextMenuItem onClick={() => {
            if (contextMenuTarget) {
              if (contextMenuTarget.type === 'directory') {
                browseFolder(contextMenuTarget.path);
              }
            }
            closeContextMenu();
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Open
          </ContextMenuItem>
          {contextMenuTarget && (
            <ContextMenuItem onClick={() => {
              if (contextMenuTarget) {
                handlePreview(contextMenuTarget);
              }
              closeContextMenu();
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Preview
            </ContextMenuItem>
          )}
          {contextMenuTarget && (
            <ContextMenuItem onClick={() => {
              if (contextMenuTarget) {
                openEditTagsDialog(contextMenuTarget);
              }
              closeContextMenu();
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit Tags
            </ContextMenuItem>
          )}
          {contextMenuTarget && (
            <ContextMenuItem onClick={() => {
              if (contextMenuTarget) {
                openRenameDialog(contextMenuTarget);
              }
              closeContextMenu();
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Rename
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={() => {
            handleCopy();
            closeContextMenu();
          }} disabled={selectedItems.length === 0}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Copy
          </ContextMenuItem>
          <ContextMenuItem onClick={() => {
            handleCut();
            closeContextMenu();
          }} disabled={selectedItems.length === 0}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Cut
          </ContextMenuItem>
          <ContextMenuItem onClick={() => {
            handlePaste();
            closeContextMenu();
          }} disabled={!clipboard}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Paste
          </ContextMenuItem>
          <ContextMenuItem onClick={() => {
            openDeleteDialog(selectedItems);
            closeContextMenu();
          }} disabled={selectedItems.length === 0} style={{ color: '#e53935' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => {
            setShowNewFolderDialog(true);
            closeContextMenu();
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New Folder
          </ContextMenuItem>
        </ContextMenu>
      )}
      
      {showPreview && previewItem && (
        <PreviewPanel>
          <PreviewHeader>
            <PreviewTitle>{previewItem.name}</PreviewTitle>
            <PreviewActions>
              <ActionButton onClick={closePreview} title="Close Preview">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m6 6 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ActionButton>
            </PreviewActions>
          </PreviewHeader>
          <PreviewContent>
            {previewError ? (
              <PreviewError>{previewError}</PreviewError>
            ) : previewItem.type === 'directory' ? (
              <PreviewText>{previewContent}</PreviewText>
            ) : ['txt', 'js', 'ts', 'jsx', 'tsx', 'json', 'md', 'html', 'css', 'scss', 'less'].includes(previewItem.name.split('.').pop()?.toLowerCase() || '') ? (
              <PreviewCode>{previewContent}</PreviewCode>
            ) : ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(previewItem.name.split('.').pop()?.toLowerCase() || '') ? (
              <PreviewImage dangerouslySetInnerHTML={{ __html: previewContent }} />
            ) : (
              <PreviewText dangerouslySetInnerHTML={{ __html: previewContent }} />
            )}
          </PreviewContent>
          <PreviewFooter>
            <PreviewInfo>
              <span>Type: {previewItem.type === 'directory' ? 'Folder' : 'File'}</span>
              {previewItem.size && <span>Size: {formatFileSize(previewItem.size)}</span>}
              {previewItem.modified && <span>Modified: {previewItem.modified.toLocaleString()}</span>}
            </PreviewInfo>
          </PreviewFooter>
        </PreviewPanel>
      )}
      
      {showProgress && (
        <ProgressBar>
          <ProgressContent>
            <ProgressMessage>{progressMessage}</ProgressMessage>
            <ProgressBarContainer>
              <ProgressBarFill style={{ width: `${progress}%` }} />
            </ProgressBarContainer>
            <ProgressPercentage>{progress}%</ProgressPercentage>
          </ProgressContent>
        </ProgressBar>
      )}
      
      {showAddTagDialog && (
        <NewFolderDialog>
          <DialogContent>
            <DialogTitle>Add New Tag</DialogTitle>
            <form onSubmit={(e) => { e.preventDefault(); handleAddTag(); }}>
              <InputField>
                <label htmlFor="newTagName">Tag Name:</label>
                <input
                  id="newTagName"
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                  autoFocus
                />
              </InputField>
              <DialogActions>
                <Button type="button" onClick={() => {
                  setShowAddTagDialog(false);
                  setNewTagName('');
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!newTagName.trim() || tags.includes(newTagName.trim())}>
                  Add
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </NewFolderDialog>
      )}
      
      {showEditTagsDialog && editTagsItem && (
        <NewFolderDialog>
          <DialogContent>
            <DialogTitle>Edit Tags for {editTagsItem.name}</DialogTitle>
            <form onSubmit={(e) => { e.preventDefault(); handleEditTags(); }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e0e0e0' }}>Select Tags:</label>
                <TagList>
                  {tags.map((tag) => (
                    <TagCheckbox key={tag}>
                      <input
                        type="checkbox"
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTags(prev => [...prev, tag]);
                          } else {
                            setSelectedTags(prev => prev.filter(t => t !== tag));
                          }
                        }}
                      />
                      <label htmlFor={`tag-${tag}`}>{tag}</label>
                    </TagCheckbox>
                  ))}
                </TagList>
              </div>
              <DialogActions>
                <Button type="button" onClick={() => {
                  setShowEditTagsDialog(false);
                  setEditTagsItem(null);
                  setSelectedTags([]);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </NewFolderDialog>
      )}

      {showKeyboardShortcuts && (
        <NewFolderDialog>
          <DialogContent>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#e0e0e0' }}>Action</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#e0e0e0' }}>Shortcut</th>
                  </tr>
                </thead>
                <tbody>
                  {keyboardShortcuts.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '10px', color: '#e0e0e0' }}>{item.action}</td>
                      <td style={{ padding: '10px', color: '#f57900' }}>{item.shortcut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <DialogActions>
              <Button type="button" onClick={() => setShowKeyboardShortcuts(false)}>
                Close
              </Button>
            </DialogActions>
          </DialogContent>
        </NewFolderDialog>
      )}

      {showRecentFiles && (
        <NewFolderDialog>
          <DialogContent>
            <DialogTitle>Recent Files</DialogTitle>
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
              {recentFiles.length > 0 ? (
                <div>
                  {recentFiles.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out' }} onClick={() => openRecentFile(item)}>
                      <div style={{ fontSize: '16px', color: '#e0e0e0' }}>
                        {getFileIcon(item.type, item.name)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', color: '#e0e0e0', marginBottom: '4px' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#888888' }}>{item.path}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#888888' }}>
                        {item.modified ? item.modified.toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#888888', padding: '40px 0' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div style={{ marginTop: '16px', fontSize: '14px' }}>No recent files</div>
                  <div style={{ marginTop: '8px', fontSize: '12px' }}>Files you open will appear here</div>
                </div>
              )}
            </div>
            <DialogActions>
              <Button type="button" onClick={clearRecentFiles} disabled={recentFiles.length === 0}>
                Clear
              </Button>
              <Button type="button" onClick={() => setShowRecentFiles(false)}>
                Close
              </Button>
            </DialogActions>
          </DialogContent>
        </NewFolderDialog>
      )}


    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow: hidden;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding-bottom: 8px;
  }
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const ActionButton = styled.button<{ isActive?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${props => props.isActive ? 'rgba(245, 121, 0, 0.2)' : props.disabled ? '#2d2d2d' : '#333333'};
  border: ${props => props.isActive ? '1px solid rgba(245, 121, 0, 0.5)' : props.disabled ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 6px;
  padding: 6px 10px;
  color: ${props => props.disabled ? '#666666' : '#e0e0e0'};
  font-size: 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.isActive ? 'scale(1.05)' : 'scale(1)'};
  box-shadow: ${props => props.isActive ? '0 2px 8px rgba(245, 121, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.2)'};

  &:hover {
    background-color: ${props => props.disabled ? '#2d2d2d' : props.isActive ? 'rgba(245, 121, 0, 0.3)' : '#3d3d3d'};
    border-color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.05)' : props.isActive ? 'rgba(245, 121, 0, 0.5)' : 'rgba(245, 121, 0, 0.5)'};
    transform: ${props => props.disabled ? 'scale(1)' : 'scale(1.05)'};
    box-shadow: ${props => props.disabled ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 3px 10px rgba(245, 121, 0, 0.25)'};
  }

  &:active {
    background-color: ${props => props.disabled ? '#2d2d2d' : '#444444'};
    transform: ${props => props.disabled ? 'scale(1)' : 'scale(0.98)'};
    box-shadow: ${props => props.disabled ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 1px 4px rgba(245, 121, 0, 0.2)'};
  }
  
  @media (max-width: 768px) {
    span {
      display: none;
    }
    padding: 6px;
    gap: 0;
  }
`;

const PathBar = styled.div`
  background-color: #2d2d2d;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px 12px;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
`;

const BreadcrumbItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const BreadcrumbSeparator = styled.span`
  color: #888888;
  font-size: 12px;
`;

const BreadcrumbLink = styled.span<{ isActive: boolean }>`
  font-size: 12px;
  color: ${props => props.isActive ? '#e0e0e0' : '#007acc'};
  cursor: ${props => props.isActive ? 'default' : 'pointer'};
  white-space: nowrap;

  &:hover:not(:active) {
    text-decoration: underline;
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  background-color: #2d2d2d;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 8px;
  }
`;

const PerformancePanel = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  max-height: 80vh;
  background-color: #252525;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 1000;
  
  @media (max-width: 768px) {
    width: 90vw;
    right: 5vw;
    left: 5vw;
    max-height: 70vh;
  }
`;

const PerformancePanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #2d2d2d;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PerformancePanelTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
`;

const PerformancePanelActions = styled.div`
  display: flex;
  gap: 8px;
`;

const PerformancePanelContent = styled.div`
  padding: 16px;
  overflow-y: auto;
  max-height: calc(80vh - 60px);
  
  @media (max-width: 768px) {
    max-height: calc(70vh - 60px);
  }
`;

const PerformanceSection = styled.div`
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const PerformanceSectionTitle = styled.h4`
  font-size: 12px;
  font-weight: 600;
  color: #f57900;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PerformanceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PerformanceLabel = styled.span`
  font-size: 12px;
  color: #888888;
`;

const PerformanceValue = styled.span`
  font-size: 12px;
  color: #e0e0e0;
  font-weight: 500;
`;

const PerformanceTips = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PerformanceTip = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #e0e0e0;
  line-height: 1.4;
  padding: 8px;
  background-color: rgba(245, 121, 0, 0.1);
  border: 1px solid rgba(245, 121, 0, 0.2);
  border-radius: 4px;
  
  svg {
    margin-top: 1px;
    color: #f57900;
    flex-shrink: 0;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 400px;
  background-color: #333333;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 6px 10px;
  
  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const SearchIcon = styled.div`
  font-size: 14px;
  color: #888888;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #e0e0e0;
  font-size: 12px;
  outline: none;

  &::placeholder {
    color: #888888;
  }
`;

const ClearSearchButton = styled.button`
  background: none;
  border: none;
  color: #888888;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #e0e0e0;
  }
`;

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const Select = styled.select`
  background-color: #333333;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 6px 10px;
  color: #e0e0e0;
  font-size: 12px;
  outline: none;
  cursor: pointer;

  &:hover {
    border-color: rgba(245, 121, 0, 0.5);
  }

  &:focus {
    border-color: #f57900;
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 12px;
  color: #888888;
`;

const Text = styled.p`
  font-size: 14px;
  margin: 0;
`;

const SubText = styled.p`
  font-size: 12px;
  color: #666666;
  margin: 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 12px;
  color: #888888;
`;

const FileListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const VirtualListContainer = styled.div`
  position: relative;
  width: 100%;
`;

const ContentSearchResults = styled.div`
  margin-top: 12px;
  border: 1px solid rgba(245, 121, 0, 0.3);
  border-radius: 4px;
  background-color: rgba(245, 121, 0, 0.05);
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid rgba(245, 121, 0, 0.3);
`;

const ResultsTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #f57900;
  margin: 0;
`;

const ResultsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const ResultItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: rgba(245, 121, 0, 0.1);
  }
`;

const ResultItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ResultFileName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #e0e0e0;
`;

const ResultMatchCount = styled.div`
  font-size: 12px;
  color: #f57900;
  background-color: rgba(245, 121, 0, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
`;

const ResultPath = styled.div`
  font-size: 12px;
  color: #888888;
  margin-bottom: 8px;
`;

const ResultPreview = styled.div`
  font-size: 13px;
  color: #cccccc;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid #f57900;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background-color: #2d2d2d;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TableHeaderCell = styled.div<{ width?: string }>`
  font-size: 12px;
  font-weight: 600;
  color: #888888;
  flex: ${props => props.width ? 'none' : '1'};
  width: ${props => props.width};
  text-align: left;
`;

const FileItemContainer = styled.div<{ isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: ${props => props.isSelected ? 'rgba(245, 121, 0, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.isSelected ? 'rgba(245, 121, 0, 0.5)' : 'transparent'};
  transform: ${props => props.isSelected ? 'translateX(4px)' : 'translateX(0)' };

  &:hover {
    background-color: ${props => props.isSelected ? 'rgba(245, 121, 0, 0.3)' : '#333333'};
    transform: ${props => props.isSelected ? 'translateX(4px)' : 'translateX(2px)' };
    box-shadow: 0 2px 8px rgba(245, 121, 0, 0.15);
  }
`;

const FileIcon = styled.div`
  font-size: 16px;
  width: 20px;
  flex-shrink: 0;
  color: #e0e0e0;
`;

const FileName = styled.span`
  font-size: 14px;
  color: #e0e0e0;
  flex: 1;
`;

const FileSizeColumn = styled.div`
  font-size: 12px;
  color: #888888;
  width: 100px;
  text-align: right;
`;

const FileModifiedColumn = styled.div`
  font-size: 12px;
  color: #888888;
  width: 150px;
  text-align: right;
`;

const FileActions = styled.div`
  display: flex;
  gap: 4px;
`;

const GridFileListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 8px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
    padding: 6px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 6px;
    padding: 4px;
  }
`;

const GridFileItemContainer = styled.div<{ isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: ${props => props.isSelected ? 'rgba(245, 121, 0, 0.2)' : '#2d2d2d'};
  border: 1px solid ${props => props.isSelected ? 'rgba(245, 121, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  box-shadow: ${props => props.isSelected ? '0 4px 12px rgba(245, 121, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.2)'};

  &:hover {
    background-color: ${props => props.isSelected ? 'rgba(245, 121, 0, 0.3)' : '#333333'};
    border-color: ${props => props.isSelected ? 'rgba(245, 121, 0, 0.5)' : 'rgba(245, 121, 0, 0.5)'};
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 6px 16px rgba(245, 121, 0, 0.25);
  }
  
  @media (max-width: 768px) {
    padding: 8px;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 6px;
    gap: 4px;
  }
`;

const FileIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  color: #e0e0e0;
  
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;

const FileNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
`;

const FileSize = styled.span`
  font-size: 11px;
  color: #888888;
`;

const FileModified = styled.span`
  font-size: 11px;
  color: #888888;
`;

const NewFolderDialog = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const DialogContent = styled.div`
  background-color: #252525;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const DialogTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0 0 16px 0;
`;

const InputField = styled.div`
  margin-bottom: 16px;

  label {
    display: block;
    font-size: 14px;
    color: #e0e0e0;
    margin-bottom: 6px;
  }

  input {
    width: 100%;
    background-color: #2d2d2d;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 8px 12px;
    color: #e0e0e0;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #f57900;
    }
  }
`;

const DialogActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:first-child {
    background-color: #333333;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #e0e0e0;

    &:hover {
      background-color: #3d3d3d;
    }
  }

  &:last-child {
    background-color: #f57900;
    border: 1px solid #f57900;
    color: white;

    &:hover {
      background-color: #e66f00;
    }

    &:disabled {
      background-color: rgba(245, 121, 0, 0.5);
      border-color: rgba(245, 121, 0, 0.5);
      cursor: not-allowed;
    }
  }
`;

const DeviceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const DeviceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #333333;
  }
`;

const DeviceIcon = styled.div`
  font-size: 20px;
  width: 24px;
  flex-shrink: 0;
  color: #e0e0e0;
`;

const DeviceName = styled.span`
  font-size: 14px;
  color: #e0e0e0;
  flex: 1;
`;

const ContextMenu = styled.div`
  position: fixed;
  background-color: #252525;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  min-width: 180px;
`;

const ContextMenuItem = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.disabled ? '#666666' : '#e0e0e0'};
  font-size: 12px;
  transition: background-color 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: #333333;
  }

  svg {
    flex-shrink: 0;
  }
`;

const ContextMenuSeparator = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
`;

const PreviewPanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background-color: #252525;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  flex-direction: column;
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #2d2d2d;
`;

const PreviewTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PreviewActions = styled.div`
  display: flex;
  gap: 8px;
`;

const PreviewContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow: auto;
  background-color: #252525;
`;

const PreviewText = styled.div`
  color: #e0e0e0;
  font-size: 14px;
  line-height: 1.5;
`;

const PreviewCode = styled.pre`
  color: #e0e0e0;
  font-size: 12px;
  line-height: 1.4;
  background-color: #1e1e1e;
  border-radius: 4px;
  padding: 12px;
  overflow: auto;
  white-space: pre-wrap;
`;

const PreviewImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-height: 500px;
`;

const PreviewError = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #e53935;
  font-size: 14px;
`;

const PreviewFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #2d2d2d;
`;

const PreviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #888888;

  span {
    display: block;
  }
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #2d2d2d;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  font-weight: 600;
  color: #f57900;
  margin-bottom: 8px;
  border-radius: 4px;
`;

const ProgressBar = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #252525;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  padding: 16px;
  min-width: 300px;
  max-width: 500px;
  z-index: 10000;
`;

const ProgressContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProgressMessage = styled.div`
  font-size: 14px;
  color: #e0e0e0;
  text-align: center;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #333333;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #f57900;
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
`;

const ProgressPercentage = styled.div`
  font-size: 12px;
  color: #888888;
  text-align: right;
`;

const TagsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background-color: #2d2d2d;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 8px;
  }
`;

const TagsTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #888888;
  white-space: nowrap;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
`;

const TagItem = styled.div<{ isSelected?: boolean; isAddButton?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${props => props.isSelected ? 'rgba(245, 121, 0, 0.3)' : props.isAddButton ? '#333333' : '#2d2d2d'};
  border: 1px solid ${props => props.isSelected ? 'rgba(245, 121, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isSelected ? '#f57900' : '#e0e0e0'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${props => props.isSelected ? 'rgba(245, 121, 0, 0.4)' : '#333333'};
    border-color: ${props => props.isSelected ? 'rgba(245, 121, 0, 0.5)' : 'rgba(245, 121, 0, 0.5)'};
  }
`;

const ClearTagButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #333333;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: #3d3d3d;
    border-color: rgba(245, 121, 0, 0.5);
  }
`;

const FileTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 4px 0;
`;

const Tag = styled.span`
  padding: 2px 6px;
  border-radius: 8px;
  background-color: rgba(245, 121, 0, 0.2);
  border: 1px solid rgba(245, 121, 0, 0.3);
  color: #f57900;
  font-size: 10px;
`;

const TagList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
`;

const TagCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #e0e0e0;
  cursor: pointer;
  
  input[type="checkbox"] {
    accent-color: #f57900;
  }
`;

const DetailsPanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background-color: #252525;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  flex-direction: column;
`;

const DetailsPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #2d2d2d;
`;

const DetailsPanelTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
`;

const DetailsPanelActions = styled.div`
  display: flex;
  gap: 8px;
`;

const DetailsPanelContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const DetailsSection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const DetailsSectionTitle = styled.h4`
  font-size: 12px;
  font-weight: 600;
  color: #f57900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px 0;
`;

const DetailsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailsLabel = styled.div`
  width: 100px;
  font-size: 12px;
  color: #888888;
  flex-shrink: 0;
`;

const DetailsValue = styled.div`
  flex: 1;
  font-size: 12px;
  color: #e0e0e0;
  word-break: break-all;
`;

const DetailsTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export default FileExplorer;