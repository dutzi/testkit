import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import MarkdownEditor from './MarkdownEditor';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AddIcon from '@material-ui/icons/Add';

const Wrapper = styled.div`
  margin: 30px -24px 0px;
  padding: 16px 24px 1px;
  background: #f7f7f7;
  border-top: 1px solid #00000022;
  border-bottom: 1px solid #00000022;
`;

const Label = styled.div`
  margin-bottom: 13px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 13px;
`;

const TestStep = ({
  onRemove,
  onDuplicate,
  onAdd,
}: {
  onRemove: () => void;
  onDuplicate: () => void;
  onAdd: () => void;
}) => {
  const handleDescriptionChange = (value: string) => {
    console.log(value);
  };
  const handleResultChange = (value: string) => {
    console.log(value);
  };
  return (
    <Wrapper>
      <MarkdownEditor
        minHeight="120px"
        onChange={handleDescriptionChange}
        placeholder="Description"
      />
      <MarkdownEditor
        minHeight="70px"
        onChange={handleResultChange}
        placeholder="Expected Result"
      />
      <ButtonContainer>
        {/* <Button variant="text" color="secondary" onClick={onRemove}>
          Remove Step
        </Button> */}
        <Tooltip title="Add Step Below">
          <IconButton onClick={onAdd} aria-label="Add Step Below">
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Duplicate">
          <IconButton onClick={onDuplicate} aria-label="Duplicate">
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={onRemove} aria-label="Delete">
            <DeleteIcon color="secondary" />
          </IconButton>
        </Tooltip>
      </ButtonContainer>
    </Wrapper>
  );
};

export default TestStep;
