import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import StepsProp from '../components/StepsProp';
import { getDocById, updateTest } from '../data-utils';
import _ from 'lodash';
import { Step, Test } from '../types';
import {
  GlobalUserContext,
  TestsCollectionContext,
  WorkspaceContext,
} from './ContextProviders';

const SelectsWrapper = styled.div`
  display: flex;
  margin-bottom: 30px;
`;

const Margin = styled.div`
  margin-right: 10px;
`;

const Row = styled.div`
  margin-bottom: 10px;
`;

const Metadata = styled.div`
  max-width: 600px;
`;

const updateTestImpl = _.debounce(updateTest, 1000);

function ScrollDialog({
  onClose,
  testId,
}: {
  onClose: (e: React.MouseEvent | null) => void;
  testId: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const globalUser = useContext(GlobalUserContext);
  const collection = useContext(TestsCollectionContext);
  const workspace = useContext(WorkspaceContext)!;
  const [testData, setTestData] = useState<Test | null>(null);

  let test: firebase.firestore.QueryDocumentSnapshot | undefined;

  if (collection) {
    test = getDocById(testId, collection.docs);
  }

  useEffect(() => {
    if (test) {
      setTestData(test.data() as Test);
    }
  }, [collection]);

  if (!testData) {
    return null;
  }

  function handleClose(e: React.MouseEvent) {
    if (!e.ctrlKey && !e.metaKey) {
      setOpen(false);
    }

    onClose(e);
  }

  function getTitle() {
    if (testId === 'new') {
      return 'New Test';
    } else {
      return `Test #${testId}`;
    }
  }

  function updateTest(data: any) {
    updateTestImpl(testId, globalUser.workspace, data, collection!);
    setTestData({
      ...testData,
      ...data,
    });
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateTest({
      name: e.currentTarget.value,
    });
  }

  function handleComponentChange(e: any) {
    const component: string = e.target.value;
    const areas = getAreas(component);
    if (areas.length) {
      updateTest({
        component,
        area: getAreas(component)[0].name,
      });
    } else {
      updateTest({
        component: null,
        area: null,
      });
    }
  }

  function handleAreaChange(e: any) {
    updateTest({
      area: e.target.value,
    });
  }

  function getAreas(componentName?: string) {
    const component =
      workspace.components[componentName || test!.data().component];

    if (component) {
      return Object.keys(component.areas).map(
        areaName => component.areas[areaName],
      );
    } else {
      return [];
    }
  }

  function handleStepsChange(steps: Step[]) {
    updateTest({
      steps,
    });
  }

  function getComponents() {
    const components = workspace.components;

    return Object.keys(components).map(componentName => {
      const component = components[componentName];
      return {
        label: component.label,
        name: component.name,
        areas: getAreas(component.name),
      };
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
      onClose(null);
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="scroll-dialog-title">{getTitle()}</DialogTitle>
        <DialogContent dividers={true}>
          <Metadata>
            <Row>
              <TextField
                id="standard-required"
                label="Name"
                margin="normal"
                value={testData.name}
                onChange={handleNameChange}
                onKeyDown={handleKeyDown}
                fullWidth
                autoFocus
              />
            </Row>
            <Row>
              <SelectsWrapper>
                <FormControl fullWidth>
                  <InputLabel htmlFor="component">Component</InputLabel>
                  <Select
                    value={testData.component}
                    onChange={handleComponentChange}
                    inputProps={{
                      name: 'component',
                      id: 'component',
                    }}
                  >
                    {getComponents().map(component => (
                      <MenuItem key={component.name} value={component.name}>
                        {component.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Margin />
                <FormControl fullWidth>
                  <InputLabel htmlFor="area">Area</InputLabel>
                  <Select
                    value={testData.area}
                    onChange={handleAreaChange}
                    inputProps={{
                      name: 'area',
                      id: 'area',
                    }}
                  >
                    {getAreas().map(area => (
                      <MenuItem key={area.name} value={area.name}>
                        {area.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </SelectsWrapper>
            </Row>
          </Metadata>
          <Row>
            <StepsProp steps={testData.steps} onChange={handleStepsChange} />
          </Row>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Save
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}

export default ScrollDialog;
