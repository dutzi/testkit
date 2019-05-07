import React from 'react';
import styled from 'styled-components';
import MarkdownEditor from './MarkdownEditor';
import IconButton from './IconButton';

const Wrapper = styled.div``;

const Label = styled.div`
  text-transform: uppercase;
  color: #676d98;
  margin-bottom: 13px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 13px;
`;

const TestStep = ({ onRemove }: { onRemove: () => void }) => {
  const handleDescriptionChange = (value: string) => {
    console.log(value);
  };
  const handleResultChange = (value: string) => {
    console.log(value);
  };
  return (
    <Wrapper>
      <Label>Description</Label>
      <MarkdownEditor minHeight="120px" onChange={handleDescriptionChange} />
      <Label>Expected Result</Label>
      <MarkdownEditor minHeight="70px" onChange={handleResultChange} />
      <ButtonContainer>
        <IconButton onClick={onRemove} label="Remove Step" icon="X" />
      </ButtonContainer>
    </Wrapper>
  );
};

export default TestStep;
