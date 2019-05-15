import React from 'react';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment';
import { TestSet } from '../types';
import TestSetProgressBar from './TestSetProgressBar';
import { formatDate } from '../utils';
import { TableLink } from '../styles';

const TestsSetsTableRow = ({
  data,
  selected,
  onClick,
  onLinkClick,
}: {
  data: TestSet;
  selected: boolean;
  onClick: (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    id: string,
  ) => void;
  onLinkClick: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string,
  ) => void;
}) => {
  return (
    <TableRow
      hover
      onClick={event => onClick(event, data.id)}
      role="checkbox"
      aria-checked={selected}
      tabIndex={-1}
      selected={selected}
      key={data.id}
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
      <TableCell align="left">
        <TestSetProgressBar testSet={data} />
      </TableCell>
      <TableCell align="left">
        {data.lastRun ? (
          <div
            dangerouslySetInnerHTML={{
              __html: formatDate(data.lastRun),
            }}
          />
        ) : (
          '-'
        )}
      </TableCell>
    </TableRow>
  );
};

export default TestsSetsTableRow;
