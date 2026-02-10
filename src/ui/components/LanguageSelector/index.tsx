import React from 'react';
import styled from 'styled-components';
import i18n from '@/i18n';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const languages = [
    { value: 'en', label: i18n.t('language.en') }
  ];

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <Container className={className}>
      <Label>{i18n.t('language.selector')}:</Label>
      <Select onChange={(e) => handleLanguageChange(e.target.value)} defaultValue={i18n.language}>
        {languages.map(lang => (
          <Option key={lang.value} value={lang.value}>
            {lang.label}
          </Option>
        ))}
      </Select>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 12px;
  color: #888888;
`;

const Select = styled.select`
  background-color: #252526;
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: #2d2d30;
  }

  &:focus {
    outline: 1px solid rgba(0, 122, 204, 0.5);
  }
`;

const Option = styled.option`
  background-color: #252526;
  color: #e0e0e0;
`;

export default LanguageSelector;