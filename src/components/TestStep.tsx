import React from 'react';
import styled from 'styled-components';
import MarkdownEditor from './MarkdownEditor';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AddIcon from '@material-ui/icons/Add';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { Step } from '../types';

const ButtonContainer = styled.div`
  display: flex;
  opacity: 0;
  justify-content: center;
`;

const Wrapper = styled.div`
  border: 1px solid var(--background-blue);
  line-height: 1.5;
  margin-bottom: 24px;

  &:hover {
    ${ButtonContainer} {
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  color: white;
  font-weight: 600;
  background: var(--background-blue);
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  padding: 6px;
`;

const Editors = styled.div`
  display: flex;
  min-height: 200px;

  div:nth-child(2) {
    flex: 65%;
  }

  div:nth-child(3) {
    flex: 0 0 35%;
  }
`;

const Sidebar = styled.div`
  flex: 0 0 110px;
`;

const ActionBar = styled.div`
  padding: 10px;
  display: flex;
  justify-content: flex-end;
`;

function TestStep({
  step,
  index,
  onRemove,
  onDuplicate,
  onAdd,
  onChange,
  allowRemove,
}: {
  step: Step;
  index: number;
  onRemove: () => void;
  onDuplicate: () => void;
  onAdd: () => void;
  onChange: (step: Step) => void;
  allowRemove: boolean;
}) {
  const handleDescriptionChange = (value: string) => {
    // debugger;
    console.log(step);
    onChange({
      ...step,
      description: value,
    });
  };

  const handleResultChange = (value: string) => {
    // debugger;
    console.log(step);
    onChange({
      ...step,
      result: value,
    });
  };

  return (
    <Wrapper>
      <Header>
        <Title>Step {index + 1}</Title>
        <ButtonContainer>
          {/* <Button variant="text" color="secondary" onClick={onRemove}>
            Remove Step
          </Button> */}
          <Tooltip title="Add Step After">
            <IconButton onClick={onAdd} aria-label="Add Step After">
              <AddIcon fontSize="small" htmlColor="white" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Duplicate">
            <IconButton onClick={onDuplicate} aria-label="Duplicate">
              <FileCopyIcon fontSize="small" htmlColor="white" />
            </IconButton>
          </Tooltip>
          {allowRemove && (
            <Tooltip title="Remove">
              <IconButton onClick={onRemove} aria-label="Remove">
                <DeleteIcon fontSize="small" htmlColor="white" />
              </IconButton>
            </Tooltip>
          )}
        </ButtonContainer>
      </Header>
      <Editors>
        <Sidebar>
          <ActionBar>
            <AddPhotoAlternateIcon htmlColor="#A6A6A6" />
          </ActionBar>
        </Sidebar>
        <MarkdownEditor
          minHeight="120px"
          onChange={handleDescriptionChange}
          placeholder="Description"
          initialValue={step.description}
        />
        <MarkdownEditor
          minHeight="70px"
          onChange={handleResultChange}
          placeholder="Expected Result"
          initialValue={step.result}
        />
      </Editors>
    </Wrapper>
  );
}

export default TestStep;
