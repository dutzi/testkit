import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { MarginH } from '../../styles';
import { GlobalUserContext, WorkspaceContext } from '../ContextProviders';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Component as IComponent, Area as IArea } from '../../types';
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';
import InputDialog from './InputDialog';
import camelcase from 'camelcase';
import { useStore, useActions } from '../../store';

const Padding = styled.div`
  padding: 30px;
`;

const Toolbar = styled.div`
  opacity: 0;
  display: inline;
`;

const Component = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.div`
  display: flex;
  align-items: center;

  &:hover {
    > ${Toolbar} {
      opacity: 1;
    }
  }
`;

const Areas = styled.div`
  margin-left: 30px;
`;

const Area = styled.div`
  &:hover {
    > ${Toolbar} {
      opacity: 1;
    }
  }
`;

const Components = () => {
  const workspace = useStore(state => state.workspace.data);
  const updateWorkspace = useActions(
    actions => actions.workspace.updateWorkspace,
  );

  const [components, setComponents] = useState<IComponent[] | undefined>();
  const [hasChanged, setHasChanged] = useState(false);
  const [dialogState, setDialogState] = useState<{
    onSubmit: (value: string) => void;
    onClose: () => void;
    title: string;
    description: string;
    inputLabel: string;
    buttonLabel: string;
  } | null>(null);

  let modifiedComponent: IComponent;

  useEffect(() => {
    if (workspace) {
      setComponents(workspace.components);
    }
  }, [workspace]);

  function handleAddArea(component: IComponent) {
    modifiedComponent = component;
    showAddAreaDialog();
  }

  function handleRemoveComponent(component: IComponent) {
    setComponents(_.remove(components, current => current !== component));
    setHasChanged(true);
  }

  function handleRemoveArea(component: IComponent, area: IArea) {
    component.areas = _.remove(component.areas, current => current !== area);
    setComponents([...components!]);
    setHasChanged(true);
  }

  function handleCloseDialog() {
    setDialogState(null);
  }

  function handleSubmitComponentDialog(value: string) {
    setComponents([
      ...components!,
      {
        label: value,
        name: camelcase(value),
        areas: [],
      },
    ]);
    setDialogState(null);
    setHasChanged(true);
  }

  function handleSubmitAreaDialog(value: string) {
    modifiedComponent.areas.push({ label: value, name: camelcase(value) });
    setComponents([...components!]);
    setDialogState(null);
    setHasChanged(true);
  }

  function showAddComponentDialog() {
    setDialogState({
      onClose: handleCloseDialog,
      onSubmit: handleSubmitComponentDialog,
      title: 'Add Component',
      description: "Enter the component's name.",
      buttonLabel: 'Add',
      inputLabel: 'Component Name',
    });
  }

  function showAddAreaDialog() {
    setDialogState({
      onClose: handleCloseDialog,
      onSubmit: handleSubmitAreaDialog,
      title: 'Add Sub Component',
      description: "Enter the sub component's name.",
      buttonLabel: 'Add',
      inputLabel: 'Sub Component Name',
    });
  }

  function handleSaveChanges() {
    if (components && workspace) {
      updateWorkspace({
        ...workspace,
        components,
      });
    }

    setHasChanged(false);
  }

  return (
    <Paper>
      <Padding>
        <Typography variant="h5">Components &amp; Sub Component</Typography>
        <MarginH />
        <div>
          <p>Add or remove components and sub component.</p>
        </div>
        <MarginH />
        {components &&
          components.map(component => (
            <Component key={component.name}>
              <Label>
                {component.label}
                <Toolbar>
                  <Tooltip title="Add Sub Component">
                    <IconButton onClick={handleAddArea.bind(null, component)}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove Component">
                    <IconButton
                      onClick={handleRemoveComponent.bind(null, component)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Tooltip>
                </Toolbar>
              </Label>
              <Areas>
                {component.areas.map(area => (
                  <Area key={area.name}>
                    {area.label}
                    <Toolbar>
                      <Tooltip title="Remove Sub Component">
                        <IconButton
                          onClick={handleRemoveArea.bind(null, component, area)}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Tooltip>
                    </Toolbar>
                  </Area>
                ))}
              </Areas>
            </Component>
          ))}
        <Button
          variant="outlined"
          color="primary"
          onClick={showAddComponentDialog}
        >
          Add Component
        </Button>
        <MarginH />
        <Button
          disabled={!hasChanged}
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </Padding>
      {dialogState && <InputDialog {...dialogState} />}
    </Paper>
  );
};

export default Components;
