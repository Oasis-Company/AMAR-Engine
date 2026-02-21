import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeType } from '../../styles/theme';

interface MediaUploaderProps {
  onMediaUpload: (files: File[]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onMediaUpload }) => {
  const { t } = useTranslation();
  const theme = useTheme<ThemeType>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [perceptionProgress, setPerceptionProgress] = useState({
    spatial: 0,
    object: 0,
    semantic: 0
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi', '.wmv']
    },
    maxFiles: 10,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
      setIsProcessing(true);
      setPerceptionProgress({ spatial: 0, object: 0, semantic: 0 });
      
      // 模拟感知进度
      simulatePerceptionProgress();
      
      onMediaUpload(acceptedFiles);
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      setIsProcessing(true);
      setPerceptionProgress({ spatial: 0, object: 0, semantic: 0 });
      
      // 模拟感知进度
      simulatePerceptionProgress();
      
      onMediaUpload(files);
    }
  };

  const simulatePerceptionProgress = () => {
    let spatial = 0;
    let object = 0;
    let semantic = 0;

    const interval = setInterval(() => {
      // 模拟不同阶段的进度
      if (spatial < 100) {
        spatial += 5;
      } else if (object < 100) {
        object += 5;
      } else if (semantic < 100) {
        semantic += 5;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        return;
      }

      setPerceptionProgress({ spatial, object, semantic });
    }, 200);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onMediaUpload(newFiles);
  };

  return (
    <Container>
      <Title>{t('mediaUploader.title')}</Title>
      <DropZone className="border"
        {...getRootProps()}
        style={{ 
          borderColor: isDragActive ? theme.colors.accent.primary : theme.colors.border,
          backgroundColor: isDragActive ? theme.colors.accent.muted : theme.colors.surface.muted
        }}
        onClick={() => {
          const input = document.getElementById('file-input') as HTMLInputElement;
          input?.click();
        }}
      >
        <input
          id="file-input"
          {...getInputProps()}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <DropZoneContent>
          {isDragActive ? (
            <>
              <Icon>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4H4C3.45 4 3 4.45 3 5V19C3 19.55 3.45 20 4 20H20C20.55 20 21 19.55 21 19V9C21 8.45 20.55 8 20 8H12M10 4V8H20M10 4L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Icon>
              <Text>{t('mediaUploader.dropZone.dragging')}</Text>
            </>
          ) : (
            <>
              <Icon>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                  <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Icon>
              <Text>{t('mediaUploader.dropZone.default')}</Text>
              <SubText>{t('mediaUploader.dropZone.subtext')}</SubText>
            </>
          )}
        </DropZoneContent>
      </DropZone>

      {isProcessing && (
        <PerceptionProgress className="fade-in slide-in">
          <ProgressTitle>{t('mediaUploader.perceptionProgress')}</ProgressTitle>
          <ProgressItem className="fade-in">
            <ProgressLabel>{t('statusBar.progress.spatial')}</ProgressLabel>
            <ProgressBarContainer>
              <ProgressBar fill={perceptionProgress.spatial} />
              <ProgressValue>{perceptionProgress.spatial}%</ProgressValue>
            </ProgressBarContainer>
          </ProgressItem>
          <ProgressItem className="fade-in" style={{ animationDelay: '0.1s' }}>
            <ProgressLabel>{t('statusBar.progress.object')}</ProgressLabel>
            <ProgressBarContainer>
              <ProgressBar fill={perceptionProgress.object} />
              <ProgressValue>{perceptionProgress.object}%</ProgressValue>
            </ProgressBarContainer>
          </ProgressItem>
          <ProgressItem className="fade-in" style={{ animationDelay: '0.2s' }}>
            <ProgressLabel>{t('statusBar.progress.semantic')}</ProgressLabel>
            <ProgressBarContainer>
              <ProgressBar fill={perceptionProgress.semantic} />
              <ProgressValue>{perceptionProgress.semantic}%</ProgressValue>
            </ProgressBarContainer>
          </ProgressItem>
        </PerceptionProgress>
      )}

      {selectedFiles.length > 0 && (
        <FilesList>
          <FilesListTitle>{t('mediaUploader.filesList', { count: selectedFiles.length })}</FilesListTitle>
          {selectedFiles.map((file, index) => (
            <FileItem key={index} className="border">
              <FileInfo>
                <FileTypeIcon>
                  {file.type.startsWith('image/') ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                      <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polygon points="10 8 16 12 10 16 10 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </FileTypeIcon>
                <FileName>{file.name}</FileName>
                <FileSize>{(file.size / 1024 / 1024).toFixed(2)} MB</FileSize>
              </FileInfo>
              <RemoveButton onClick={() => handleRemoveFile(index)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m6 6 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </RemoveButton>
            </FileItem>
          ))}
        </FilesList>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  height: 100%;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.h5.fontSize};
  font-weight: ${({ theme }) => theme.typography.h5.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const DropZone = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: ${({ theme }) => theme.colors.surface.muted};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent.primary};
    background-color: ${({ theme }) => theme.colors.accent.muted};
  }
  
  @media (max-width: 768px) {
    padding: 40px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 30px 15px;
  }
`;

const DropZoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Icon = styled.div`
  font-size: 64px;
  opacity: 0.7;
  color: ${({ theme }) => theme.colors.accent.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 64px;
    height: 64px;
  }
  
  @media (max-width: 768px) {
    font-size: 48px;
    
    svg {
      width: 48px;
      height: 48px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 36px;
    
    svg {
      width: 36px;
      height: 36px;
    }
  }
`;

const Text = styled.p`
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const SubText = styled.p`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  max-width: 80%;
  text-align: center;
`;

const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilesListTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  font-weight: ${({ theme }) => theme.typography.body2.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface.elevated};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface.hover};
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FileTypeIcon = styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FileName = styled.span`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileSize = styled.span`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RemoveButton = styled.button`
  background-color: ${({ theme }) => theme.colors.status.error.muted};
  color: ${({ theme }) => theme.colors.status.error.primary};
  border: 1px solid ${({ theme }) => theme.colors.status.error.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 4px 8px;
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.status.error.hover};
    color: ${({ theme }) => theme.colors.text.inverse};
  }
`;

const PerceptionProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface.elevated};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProgressTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  font-weight: ${({ theme }) => theme.typography.body2.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ProgressItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProgressLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProgressBar = styled.div<{ fill: number }>`
  flex: 1;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.surface.muted};
  border-radius: 3px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.fill}%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.accent.primary};
    border-radius: 3px;
    transition: width 0.3s ease-in-out;
  }
`;

const ProgressValue = styled.span`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  min-width: 40px;
  text-align: right;
`;

export default MediaUploader;