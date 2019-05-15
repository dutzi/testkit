import React, { useState } from 'react';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import moment from 'moment';
import { getComponents } from '../data/components';
import { Component } from '../types';
import { formatDate } from '../utils';

const TableLink = styled.a`
  text-decoration: none;
  color: #000000de;
  outline: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    background: #00000022;
    border-radius: 4px;
    padding: 4px;
    margin: -4px;
  }
`;

const StatusIconWrapper = styled.div`
  line-height: 0px;
`;

const TestsTableRow = ({
  data,
  selected,
  onClick,
  onLinkClick,
  workspace,
}: {
  data: any;
  selected: boolean;
  onClick: (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    id: string,
  ) => void;
  onLinkClick: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string,
  ) => void;
  workspace: string;
}) => {
  const [components, setComponents] = useState<Component[]>([]);
  getComponents(workspace).then(setComponents);

  function getComponentLabel(componentName: string) {
    let component = components.find(component => {
      return component.name === componentName;
    });

    if (component) {
      return component.label;
    } else {
      return '-';
    }
  }

  function getAreaLabel(componentName: string, areaName: string) {
    let component = components.find(component => {
      return component.name === componentName;
    });

    if (component) {
      let area = component.areas.find(area => {
        return area.name === areaName;
      });

      if (area) {
        return area.label;
      } else {
        return '-';
      }
    } else {
      return '-';
    }
  }

  function renderDateTime(data: any) {
    return data ? (
      <div
        dangerouslySetInnerHTML={{
          __html: formatDate(data),
        }}
      />
    ) : (
      '-'
    );
  }

  return (
    <TableRow
      hover
      onClick={event => onClick(event, data.id)}
      role="checkbox"
      aria-checked={selected}
      tabIndex={-1}
      selected={selected}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={selected} />
      </TableCell>
      <TableCell component="th" scope="row" align="right">
        {data.id}
      </TableCell>
      <TableCell component="th" scope="row" padding="none">
        <TableLink onClick={event => onLinkClick(event, data.id)} href="#">
          {data.name || '(untitled)'}
        </TableLink>
      </TableCell>
      <TableCell align="left">{data.state}</TableCell>
      <TableCell align="left">
        <StatusIconWrapper>
          {data.status === 'passed' && <CheckIcon color="primary" />}
          {data.status === 'failed' && <CloseIcon color="error" />}
          {data.status === 'no-run' && <RemoveIcon color="disabled" />}
        </StatusIconWrapper>
      </TableCell>
      <TableCell align="left">{renderDateTime(data.lastRun)}</TableCell>
      <TableCell align="left">{renderDateTime(data.modified)}</TableCell>
      <TableCell align="left">{getComponentLabel(data.component)}</TableCell>
      <TableCell align="left">
        {getAreaLabel(data.component, data.area)}
      </TableCell>
    </TableRow>
  );
};

export default TestsTableRow;
