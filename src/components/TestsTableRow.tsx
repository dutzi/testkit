import React, { useContext } from 'react';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import { formatDate } from '../utils';
import { TableLink } from '../styles';
import { WorkspaceContext } from '../views/ContextProviders';

const StatusIconWrapper = styled.div`
  line-height: 0px;
`;

const TestsTableRow = ({
  data,
  selected,
  onClick,
  onLinkClick,
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
}) => {
  const workspace = useContext(WorkspaceContext);
  // const [components, setComponents] = useState<Component[]>([]);
  // getComponents(workspace).then(setComponents);

  function getComponentLabel(componentName: string) {
    let component = workspace!.components.find(
      component => component.name === componentName,
    );

    if (component) {
      return component.label;
    } else {
      return '-';
    }
  }

  function getAreaLabel(componentName: string, areaName: string) {
    let component = workspace!.components.find(
      component => component.name === componentName,
    );

    if (component) {
      let area = component.areas.find(area => area.name === areaName);

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
          {data.status === 'skipped' && <RemoveIcon color="disabled" />}
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
