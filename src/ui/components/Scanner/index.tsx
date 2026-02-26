import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface ScannerProps {
  onScannerProcess: (files: File[]) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScannerProcess }) => {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      onScannerProcess(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      onScannerProcess(files);
    }
  };

  const allowedExtensions = ['.ply', '.splat'];

  const isFileAllowed = (file: File) => {
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    return allowedExtensions.includes(extension);
  };

  return (
    <Container>
      <Title>AME Scanner</Title>
      <Subtitle>Upload 3DGS files (.ply, .splat) for spatial analysis</Subtitle>
      
      <UploadArea
        dragging={dragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <InputContainer>
          <Input
            type="file"
            accept=".ply,.splat"
            multiple
            onChange={handleFileChange}
          />
          <UploadButton>
            <UploadIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </UploadIcon>
            <UploadText>Choose Files</UploadText>
          </UploadButton>
        </InputContainer>
        <DropText>or drag and drop files here</DropText>
      </UploadArea>

      {selectedFiles.length > 0 && (
        <FilesList>
          <FilesTitle>Selected Files:</FilesTitle>
          {selectedFiles.map((file, index) => (
            <FileItem key={index} valid={isFileAllowed(file)}>
              <FileIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </FileIcon>
              <FileInfo>
                <FileName>{file.name}</FileName>
                <FileSize>{(file.size / 1024 / 1024).toFixed(2)} MB</FileSize>
              </FileInfo>
              <FileStatus valid={isFileAllowed(file)}>
                {isFileAllowed(file) ? 'Valid' : 'Invalid format'}
              </FileStatus>
            </FileItem>
          ))}
        </FilesList>
      )}

      <InfoBox>
        <InfoIcon>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </InfoIcon>
        <InfoText>
          AME Scanner will analyze your 3DGS files and generate spatial structure information.
          Supported formats: .ply, .splat
        </InfoText>
      </InfoBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.h5.fontSize};
  font-weight: ${({ theme }) => theme.typography.h5.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const UploadArea = styled.div<{ dragging: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 2px dashed ${({ theme, dragging }) => dragging ? theme.colors.primary : theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme, dragging }) => dragging ? 'rgba(0, 122, 204, 0.1)' : theme.colors.background.tertiary};
  transition: all 0.2s ease-in-out;
  min-height: 200px;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  font-weight: ${({ theme }) => theme.typography.body2.fontWeight};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    opacity: 0.9;
  }
`;

const UploadIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UploadText = styled.span`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
`;

const DropText = styled.p`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const FilesTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  font-weight: ${({ theme }) => theme.typography.body1.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const FileItem = styled.div<{ valid: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme, valid }) => valid ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  border: 1px solid ${({ theme, valid }) => valid ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
`;

const FileIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FileInfo = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

const FileSize = styled.div`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FileStatus = styled.div<{ valid: boolean }>`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme, valid }) => valid ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)'};
`;

const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: rgba(33, 150, 243, 0.1);
  border: 1px solid rgba(33, 150, 243, 0.3);
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const InfoIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 2px;
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

export default Scanner;