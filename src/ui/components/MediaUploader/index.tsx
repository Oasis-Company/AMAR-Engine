import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

interface MediaUploaderProps {
  onMediaUpload: (files: File[]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onMediaUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi', '.wmv']
    },
    maxFiles: 10,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
      onMediaUpload(acceptedFiles);
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      onMediaUpload(files);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onMediaUpload(newFiles);
  };

  return (
    <Container>
      <Title>Media Uploader</Title>
      <DropZone
        {...getRootProps()}
        style={{ borderColor: isDragActive ? '#007acc' : '#444444', backgroundColor: isDragActive ? '#007acc10' : '#252526' }}
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
              <Text>Drop your files here...</Text>
            </>
          ) : (
            <>
              <Icon>📷</Icon>
              <Text>Drag & drop photos or videos here, or click to select files</Text>
              <SubText>Supports JPG, PNG, GIF, MP4, MOV (max 50MB per file)</SubText>
            </>
          )}
        </DropZoneContent>
      </DropZone>

      {selectedFiles.length > 0 && (
        <FilesList>
          <FilesListTitle>Selected Files ({selectedFiles.length})</FilesListTitle>
          {selectedFiles.map((file, index) => (
            <FileItem key={index}>
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
  padding: 20px;
  background-color: #1e1e1e;
  border-radius: 8px;
  height: 100%;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const DropZone = styled.div`
  border: 2px dashed #444444;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #252526;

  &:hover {
    border-color: #007acc;
    background-color: #007acc08;
  }
`;

const DropZoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Icon = styled.div`
  font-size: 48px;
`;

const Text = styled.p`
  font-size: 16px;
  color: #cccccc;
  margin: 0;
`;

const SubText = styled.p`
  font-size: 12px;
  color: #888888;
  margin: 0;
`;

const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilesListTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #252526;
  border-radius: 4px;
  border: 1px solid #3e3e42;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FileTypeIcon = styled.div`
  font-size: 20px;
`;

const FileName = styled.span`
  font-size: 14px;
  color: #cccccc;
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
  background-color: #f48771;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #e74c3c;
  }
`;

export default MediaUploader;