import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Column } from '../../data/table-columns';
import Toolbar from './Toolbar';
import TableHead from './TableHead';

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
  onOpenTest: (id: string, e: React.MouseEvent) => void;
  columns: Column[];
  rowRenderer: (props: any) => any;
  selected: string[];
  setSelected: (selected: string[]) => void;
};

type EnhancedTableState = {
  order: 'asc' | 'desc' | undefined;
  orderBy: string;
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
      this.props.setSelected(this.props.data.map((n: any) => n.id));
      return;
    }
    this.props.setSelected([]);
  };

  handleClick = (event: React.MouseEvent, id: string) => {
    const { selected } = this.props;
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

    this.props.setSelected(newSelected);
    // this.setState({ selected: newSelected });
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
    this.props.onOpenTest(id, e);
  };

  handleAction = (action: string) => {
    this.props.onAction(action, this.props.selected);
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

  isSelected = id => this.props.selected.indexOf(id) !== -1;

  render() {
    const { classes, data, columns, selected, rowRenderer } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Wrapper>
        <Paper className={classes.root}>
          <Toolbar
            actions={this.props.actions}
            onAction={this.handleAction}
            numSelected={selected.length}
          />
          <div className={classes.tableWrapper} onScroll={this.handleScroll}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <TableHead
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
                    return rowRenderer({
                      key: n.id,
                      onLinkClick: this.handleLinkClick,
                      onClick: this.handleClick,
                      selected: isSelected,
                      data: n,
                    });
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