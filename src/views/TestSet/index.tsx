import React, { useContext } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router';
import {
  TestSet as ITestSet,
  Test,
  TestStatus,
  WorkspaceUser,
} from '../../types';
import TestPreview from '../../components/TestPreview';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PublishIcon from '@material-ui/icons/Publish';
import Select, { mapData } from '../../components/Select';
import { MarginH, MarginV } from '../../styles';
import { WorkspaceContext } from '../ContextProviders';
import { useUsers } from '../../hooks';
import { useTestSet } from './hooks';

const Wrapper = styled.div`
  padding: 24px;
  overflow: auto;
`;

const MaxWidth = styled.div`
  max-width: 1024px;
`;

const SelectsWrapper = styled.div`
  display: flex;
`;

const FormWrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
`;

const InputsWrapper = styled.div`
  max-width: 700px;
  flex: 0 1 700px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: flex-start;
`;

function mapUsers(users: WorkspaceUser[]) {
  return users.map(user => ({ name: user.displayName, id: user.uid }));
}

const TestSet = ({
  id,
  onRun,
  match,
  location,
  history,
}: {
  id: string;
  onRun: (e: React.MouseEvent) => void;
  match: any;
  location: any;
  history: any;
}) => {
  const [
    testSet,
    updateTestSet,
    onSave,
    isCreating,
    testsInTestSet,
  ] = useTestSet(id);

  const workspace = useContext(WorkspaceContext)!;
  const users = useUsers();

  if (!testSet) {
    return null;
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateTestSet({
      name: e.currentTarget.value,
    });
  }

  function handlePlatformChange(e: any) {
    updateTestSet({
      platform: e.target.value,
    });
  }

  function handleAssigneeChange(e: any) {
    updateTestSet({
      assignee: e.target.value,
    });
  }

  function handleSave() {
    onSave().then(nextId => {
      history.push(`/test-sets/${nextId}`);
    });
  }

  function getTestSetField(fieldName: keyof ITestSet) {
    if (testSet) {
      return testSet[fieldName];
    } else {
      return '';
    }
  }

  function handleRun(e: React.MouseEvent) {
    updateTestSet({ lastRun: new Date() });
    onRun(e);
  }

  function renderActions() {
    if (isCreating) {
      return (
        <React.Fragment>
          <Button variant="contained" color="primary" onClick={handleSave}>
            <MarginV margin="-6px" />
            <PublishIcon />
            <MarginV margin="6px" />
            Publish
          </Button>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Button variant="text" color="primary">
            Run&nbsp;Remaining
          </Button>
          <MarginV margin="12px" />
          <Button variant="contained" color="primary" onClick={handleRun}>
            <MarginV margin="-6px" />
            <PlayArrowIcon />
            <MarginV margin="6px" />
            Run
          </Button>
        </React.Fragment>
      );
    }
  }

  return (
    <Wrapper>
      <MaxWidth>
        <FormWrapper>
          <InputsWrapper>
            <TextField
              id="standard-required"
              label="Name"
              margin="normal"
              value={getTestSetField('name')}
              onChange={handleNameChange}
              fullWidth
              autoFocus
            />
            <MarginH />
            <SelectsWrapper>
              <Select
                title="Platform"
                name="platform"
                onChange={handlePlatformChange}
                allowNone
                data={mapData(workspace.platforms)}
                value={getTestSetField('platform')}
              />
              <MarginV />
              <Select
                title="Assignee"
                name="user"
                onChange={handleAssigneeChange}
                allowNone
                data={mapUsers(users)}
                value={getTestSetField('assignee')}
              />
            </SelectsWrapper>
          </InputsWrapper>
          <ActionsWrapper>{renderActions()}</ActionsWrapper>
        </FormWrapper>
        <Typography variant="h6" component="p">
          Tests ({testsInTestSet.length})
        </Typography>
        <MarginH />
        {testsInTestSet.map(
          ({ test, status }: { test: Test; status: TestStatus }) => (
            <TestPreview
              key={test.id}
              test={test}
              status={status}
              showProgress={!isCreating}
            />
          ),
        )}
      </MaxWidth>
    </Wrapper>
  );
};

export default withRouter(TestSet);
