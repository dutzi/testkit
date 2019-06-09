import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import StepsProp from '../../components/StepsProp';
import { getDocById } from '../../clients/utils';
import _ from 'lodash';
import { Step, Test } from '../../types';
import {
  GlobalUserContext,
  TestsCollectionContext,
  WorkspaceContext,
} from '../ContextProviders';
import { useTest } from './hooks';

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

  const [test, updateTest] = useTest(testId);
  const workspace = useContext(WorkspaceContext)!;

  if (!test) {
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
        component: undefined,
        area: undefined,
      });
    }
  }

  function handleAreaChange(e: any) {
    updateTest({
      area: e.target.value,
    });
  }

  function getAreas(componentName?: string) {
    componentName = componentName || test!.component;
    const component = workspace.components.find(
      component => component.name === componentName,
    );

    if (component) {
      return component.areas;
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

  function handleDismiss() {
    onClose(null);
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
                value={test.name}
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
                  <NativeSelect
                    value={test.component}
                    onChange={handleComponentChange}
                    inputProps={{
                      name: 'component',
                      id: 'component',
                    }}
                  >
                    {getComponents().map(component => (
                      <option key={component.name} value={component.name}>
                        {component.label}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                <Margin />
                <FormControl fullWidth>
                  <InputLabel htmlFor="area">Sub Component</InputLabel>
                  <NativeSelect
                    value={test.area}
                    onChange={handleAreaChange}
                    inputProps={{
                      name: 'area',
                      id: 'area',
                    }}
                  >
                    {getAreas().map(area => (
                      <option key={area.name} value={area.name}>
                        {area.label}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
              </SelectsWrapper>
            </Row>
          </Metadata>
          <Row>
            <StepsProp
              onDismiss={handleDismiss}
              steps={test.steps}
              onChange={handleStepsChange}
            />
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
