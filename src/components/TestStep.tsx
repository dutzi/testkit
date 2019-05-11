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
`;

class TestStep extends React.Component<{
  step: Step;
  index: number;
  onRemove: () => void;
  onDuplicate: () => void;
  onAdd: () => void;
  onChange: (step: Step) => void;
  allowRemove: boolean;
}> {
  handleDescriptionChange = (value: string) => {
    this.props.onChange({
      ...this.props.step,
      description: value,
    });
  };

  handleResultChange = (step: Step, value: string) => {
    this.props.onChange({
      ...this.props.step,
      result: value,
    });
  };

  render() {
    const { step, index } = this.props;
    return (
      <Wrapper>
        <Sidebar>
          <Header>Step {index + 1}</Header>
          <ButtonContainer>
            {/* <Button variant="text" color="secondary" onClick={onRemove}>
            Remove Step
          </Button> */}
            <Tooltip title="Add Step After">
              <IconButton
                onClick={this.props.onAdd}
                aria-label="Add Step After"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Duplicate">
              <IconButton
                onClick={this.props.onDuplicate}
                aria-label="Duplicate"
              >
                <FileCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {this.props.allowRemove && (
              <Tooltip title="Remove">
                <IconButton onClick={this.props.onRemove} aria-label="Remove">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </ButtonContainer>
        </Sidebar>
        <Editors>
          <MarkdownEditor
            minHeight="120px"
            onChange={this.handleDescriptionChange}
            placeholder="Description"
            initialValue={step.description}
          />
          <MarkdownEditor
            minHeight="70px"
            onChange={this.handleResultChange.bind(null, step)}
            placeholder="Expected Result"
            initialValue={step.result}
          />
        </Editors>
      </Wrapper>
    );
  }
}

export default TestStep;
