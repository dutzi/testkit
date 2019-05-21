import React from 'react';
import styled from 'styled-components';
import MarkdownEditor from './MarkdownEditor';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AddIcon from '@material-ui/icons/Add';
import { Step } from '../types';

const ButtonContainer = styled.div`
  display: flex;
  opacity: 0;
  justify-content: center;
`;

const Wrapper = styled.div`
  margin: 0px -24px;
  background: #f7f7f7;

  &:nth-of-type(1) {
    border-top: 1px solid #00000022;
  }
  border-bottom: 1px solid #00000022;
  display: flex;
  line-height: 1.5;

  &:hover {
    ${ButtonContainer} {
      opacity: 1;
    }
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 110px;
  padding: 10px 0px 4px;
`;

const Header = styled.div`
  padding: 0px 24px;
  color: #787878;
`;

const Editors = styled.div`
  flex: 1;
  width: calc(100% - 110px);
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
      <Sidebar>
        <Header>Step {index + 1}</Header>
        <ButtonContainer>
          {/* <Button variant="text" color="secondary" onClick={onRemove}>
            Remove Step
          </Button> */}
          <Tooltip title="Add Step After">
            <IconButton onClick={onAdd} aria-label="Add Step After">
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Duplicate">
            <IconButton onClick={onDuplicate} aria-label="Duplicate">
              <FileCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {allowRemove && (
            <Tooltip title="Remove">
              <IconButton onClick={onRemove} aria-label="Remove">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </ButtonContainer>
      </Sidebar>
      <Editors>
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
