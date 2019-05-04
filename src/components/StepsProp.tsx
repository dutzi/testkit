import React from 'react';
import styled from 'styled-components';
import MarkdownEditor from './MarkdownEditor';
import IconButton from './IconButton';

const Wrapper = styled.div``;

const TopLabel = styled.div`
  text-transform: uppercase;
  color: var(--text-color);
  margin-bottom: 13px;
`;

const Label = styled.div`
  text-transform: uppercase;
  color: #676d98;
  margin-bottom: 13px;
`;

const AddStepContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 13px;
`;

const StepsProp = () => {
  return (
    <Wrapper>
      <TopLabel>Steps</TopLabel>
      <Label>Description</Label>
      <MarkdownEditor minHeight="120px" />
      <Label>Expected Result</Label>
      <MarkdownEditor minHeight="70px" />
      <AddStepContainer>
        <IconButton label="Add A Step" icon={'Plus'} />
      </AddStepContainer>
    </Wrapper>
  );
};

export default StepsProp;
