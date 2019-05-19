import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ArchiveIcon from '@material-ui/icons/Archive';
// import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
// import SettingsInputComponentIcon from '@material-ui/icons/SettingsInputComponent';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonIcon from '@material-ui/icons/Person';
import { withRouter } from 'react-router';
import { navigateTo } from '../utils';
import { MarginV } from '../styles';

const styles = theme => ({
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: 16,
    paddingBottom: 16,
  },
  firebase: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.common.white,
  },
  itemActionable: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    color: 'inherit',
    fontSize: theme.typography.fontSize,
    '&$textDense': {
      fontSize: theme.typography.fontSize,
    },
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

const Navigator = ({
  location,
  history,
  classes,
}: {
  location: any;
  history: any;
  classes?: any;
}) => {
  const categories = [
    {
      id: 'Project',
      children: [
        {
          id: 'Tests',
          icon: <DescriptionIcon />,
          path: '/tests',
          active: location.pathname.startsWith('/tests'),
        },
        {
          id: 'Test Sets',
          icon: <DoneAllIcon />,
          path: '/test-sets',
          active: location.pathname.startsWith('/test-sets'),
        },
        {
          id: 'Archived Tests',
          icon: <ArchiveIcon />,
          path: '/archived-tests',
          active: location.pathname.startsWith('/archived-tests'),
        },
      ],
    },
    {
      id: 'Settings',
      children: [
        {
          id: 'Workspace Settings',
          icon: <SettingsIcon />,
          path: '/settings',
          active: location.pathname.startsWith('/settings'),
        },
        {
          id: 'Profile',
          icon: <PersonIcon />,
          path: '/profile',
          active: location.pathname.startsWith('/profile'),
        },
      ],
    },
  ];

  function handleListItemClick(path: string, e: React.MouseEvent) {
    navigateTo(path, e, history);
  }

  return (
    <Drawer variant="permanent">
      <List disablePadding style={{ width: '256px' }}>
        <ListItem
          className={clsx(classes.firebase, classes.item, classes.itemCategory)}
        >
          <MarginV margin="5px" />
          {'🧪'}
          <MarginV /> TestKit
        </ListItem>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Overview
          </ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active, path }) => (
              <ListItem
                onClick={handleListItemClick.bind(null, path)}
                button
                dense
                key={childId}
                className={clsx(
                  classes.item,
                  classes.itemActionable,
                  active && classes.itemActiveItem,
                )}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default withStyles(styles)(withRouter(Navigator));
