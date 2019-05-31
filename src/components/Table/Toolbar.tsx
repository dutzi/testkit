import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';

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
  function handleToggleFilter() {
    onAction('toggle-filter');
  }

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
          <IconButton onClick={handleToggleFilter} aria-label="Filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
