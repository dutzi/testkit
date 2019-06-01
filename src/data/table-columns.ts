export interface Column {
  id: string;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
  large?: boolean;
  small?: boolean;
}

export const testsTableColumns: Column[] = [
  {
    id: 'id',
    numeric: true,
    disablePadding: false,
    label: 'Id',
    small: true,
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
    large: true,
  },
  // { id: 'state', numeric: false, disablePadding: false, label: 'State' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  {
    id: 'lastRun',
    numeric: false,
    disablePadding: false,
    label: 'Last&nbsp;Run',
  },
  { id: 'modified', numeric: false, disablePadding: false, label: 'Modified' },
  {
    id: 'component',
    numeric: false,
    disablePadding: false,
    label: 'Component',
  },
  {
    id: 'area',
    numeric: false,
    disablePadding: false,
    label: 'Sub&nbsp;Component',
  },
];

export const testSetsTableColumns: Column[] = [
  {
    id: 'id',
    numeric: true,
    disablePadding: false,
    label: 'Id',
    small: true,
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
    large: true,
  },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'lastRun', numeric: false, disablePadding: false, label: 'Last Run' },
];
