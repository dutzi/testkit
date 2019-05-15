import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import { Column } from '../../data/table-columns';

type EnhancedTableHeadProps = {
  numSelected: number;
  onRequestSort: (event: any, property: any) => void;
  onSelectAllClick: (event: any) => void;
  order: 'desc' | 'asc' | undefined;
  orderBy: string;
  rowCount: number;
  classes: any;
  columns: Column[];
};

const tableHeadStyles = theme => ({
  root: {
    background: 'white',
  },
  wide: {
    // width: '40%',
  },
  narrow: {
    width: '10px',
  },
});

class EnhancedTableHead extends React.Component<EnhancedTableHeadProps> {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      classes,
      columns,
    } = this.props;

    return (
      <TableHead className={classes.root}>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columns.map(
            column => (
              <TableCell
                className={classNames({
                  [classes.wide]: column.large,
                  [classes.narrow]: column.small,
                })}
                key={column.id}
                align={column.numeric ? 'right' : 'left'}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    <div dangerouslySetInnerHTML={{ __html: column.label }} />
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

export default withStyles(tableHeadStyles)(EnhancedTableHead);
