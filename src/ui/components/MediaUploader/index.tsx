import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface MediaUploaderProps {
  onMediaUpload: (files: File[]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onMediaUpload }) => {
  const { t } = useTranslation();
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
        style={{ borderColor: isDragActive ? '#007acc' : 'rgba(255, 255, 255, 0.1)', backgroundColor: isDragActive ? 'rgba(0, 122, 204, 0.1)' : 'rgba(255, 255, 255, 0.05)' }}
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
              <Icon>📁</Icon>
              <Text>{t('mediaUploader.dropZone.dragging')}</Text>
            </>
          ) : (
            <>
              <Icon>📷</Icon>
              <Text>{t('mediaUploader.dropZone.default')}</Text>
              <SubText>{t('mediaUploader.dropZone.subtext')}</SubText>
            </>
          )}
        </DropZoneContent>
      </DropZone>

      {isProcessing && (
        <PerceptionProgress className="fade-in slide-in">
          <ProgressTitle>Perception Progress</ProgressTitle>
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
                  {file.type.startsWith('image/') ? '🖼️' : '🎬'}
                </FileTypeIcon>
                <FileName>{file.name}</FileName>
                <FileSize>{(file.size / 1024 / 1024).toFixed(2)} MB</FileSize>
              </FileInfo>
              <RemoveButton onClick={() => handleRemoveFile(index)}>
                ✕
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
  gap: 16px;
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
`;

const DropZone = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #2d2d2d;

  &:hover {
    border-color: #f57900;
    background-color: rgba(245, 121, 0, 0.1);
  }
`;

const DropZoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Icon = styled.div`
  font-size: 64px;
  opacity: 0.7;
  color: #f57900;
`;

const Text = styled.p`
  font-size: 16px;
  color: #e0e0e0;
  margin: 0;
`;

const SubText = styled.p`
  font-size: 12px;
  color: #888888;
  margin: 0;
  max-width: 80%;
  text-align: center;
`;

const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilesListTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #2d2d2d;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #333333;
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FileTypeIcon = styled.div`
  font-size: 20px;
  color: #e0e0e0;
`;

const FileName = styled.span`
  font-size: 14px;
  color: #e0e0e0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileSize = styled.span`
  font-size: 12px;
  color: #888888;
`;

const RemoveButton = styled.button`
  background-color: rgba(244, 135, 113, 0.2);
  color: #f48771;
  border: 1px solid rgba(244, 135, 113, 0.3);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(244, 135, 113, 0.3);
    color: #ffffff;
  }
`;

const PerceptionProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: #2d2d2d;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProgressTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
`;

const ProgressItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProgressLabel = styled.span`
  font-size: 12px;
  color: #888888;
`;

const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProgressBar = styled.div<{ fill: number }>`
  flex: 1;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.fill}%;
    height: 100%;
    background-color: #f57900;
    border-radius: 3px;
    transition: width 0.3s ease-in-out;
  }
`;

const ProgressValue = styled.span`
  font-size: 12px;
  color: #888888;
  min-width: 40px;
  text-align: right;
`;

export default MediaUploader;