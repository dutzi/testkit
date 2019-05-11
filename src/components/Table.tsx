import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Column } from '../data/table-columns';

const Wrapper = styled.div``;

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

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
    width: '40%',
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

const EnhancedTableHeadWithStyles = withStyles(tableHeadStyles)(
  EnhancedTableHead,
);

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
    display: 'flex',
  },
  title: {
    flex: '0 0 auto',
  },
});

const EnhancedTableToolbar = ({
  classes,
  numSelected,
  onAction,
  actions,
}: // onDuplicate,
// onArchive,
{
  classes: {
    root: string;
    highlight: string;
    spacer: string;
    actions: string;
    title: string;
  };
  numSelected: number;
  onAction: (action: string) => void;
  actions: any[];
  // onDuplicate: () => void;
  // onArchive: () => void;
}) => {
  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Tests
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      {/* <Input
        placeholder="Filter"
        // className={classes.input}
        fullWidth
        inputProps={{
          'aria-label': 'Filter',
        }}
      /> */}
      <div className={classes.spacer} />

      <div className={classes.actions}>
        {numSelected > 0 &&
          actions.map(action => (
            <Tooltip key={action.title} title={action.title}>
              <IconButton
                onClick={onAction.bind(null, action.title)}
                aria-label={action.title}
              >
                <action.icon />
              </IconButton>
            </Tooltip>
          ))}
        <Tooltip title="Filter list">
          <IconButton aria-label="Filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
};

const EnhancedTableToolbarWithStyles = withStyles(toolbarStyles)(
  EnhancedTableToolbar,
);

const styles = theme => ({
  root: {
    marginTop: theme.spacing(3),
    width: 'calc(100% - 40px)',
    margin: '24px 20px',
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    maxHeight: 'calc(100vh - 210px)',
    overflow: 'auto',
  },
});

type EnhancedTableProps = {
  classes: {
    root: string;
    tableWrapper: string;
    table: string;
  };
  data: object[];
  actions: object[];
  onAction: (action: string, selectedIds: string[]) => void;
  // onDuplicate: (selectedIds: string[]) => void;
  // onArchive: (selectedIds: string[]) => void;
  onOpenTest: (id: string) => void;
  columns: Column[];
  rowRenderer: any;
};

type EnhancedTableState = {
  order: 'asc' | 'desc' | undefined;
  orderBy: string;
  selected: string[];
  page: number;
  rowsPerPage: number;
};

class EnhancedTable extends React.Component<
  EnhancedTableProps,
  EnhancedTableState
> {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'calories',
      selected: [],
      page: 0,
      rowsPerPage: 5,
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order: 'desc' | 'asc' = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({
        selected: this.props.data.map((n: any) => n.id),
      }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event: React.MouseEvent, id: string) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onOpenTest(id);
  };

  handleAction = (action: string) => {
    this.props.onAction(action, this.state.selected);
  };

  handleScroll = e => {
    const head = document.querySelector<HTMLTableHeaderCellElement>(
      'table thead',
    );
    if (head) {
      head.style.transform = `translateY(${e.target.scrollTop}px)`;
      // console.log(e.target.scrollTop);
    }
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, data, columns, rowRenderer } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const RowRenderer = rowRenderer;
    return (
      <Wrapper>
        <Paper className={classes.root}>
          <EnhancedTableToolbarWithStyles
            actions={this.props.actions}
            onAction={this.handleAction}
            numSelected={selected.length}
          />
          <div className={classes.tableWrapper} onScroll={this.handleScroll}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHeadWithStyles
                columns={columns}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const isSelected = this.isSelected(n.id);
                    return (
                      <RowRenderer
                        key={n.id}
                        onLinkClick={this.handleLinkClick}
                        onClick={this.handleClick}
                        selected={isSelected}
                        data={n}
                      />
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={columns.length + 1} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </Wrapper>
    );
  }
}

export default withStyles(styles)(EnhancedTable);
