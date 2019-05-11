import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import MateriualBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  paper: {
    padding: theme.spacing(1, 2),
  },
}));

interface Location {
  name: string;
  href: string;
}

function Breadcrumbs({
  locations,
  onClick,
}: {
  locations: Location[];
  onClick: (location: Location) => void;
}) {
  function handleClick(location: Location, event) {
    event.preventDefault();
    onClick(location);
  }

  const classes = useStyles();
  const links = locations.slice(0, locations.length - 1);
  const lastLocation = locations[locations.length - 1];

  return (
    <div className={classes.root}>
      <MateriualBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="Breadcrumb"
      >
        {links.map(link => (
          <Link
            key={link.href}
            color="inherit"
            href={link.href}
            onClick={handleClick.bind(null, link)}
          >
            {link.name}
          </Link>
        ))}
        <Typography color="textPrimary">{lastLocation.name}</Typography>
      </MateriualBreadcrumbs>
    </div>
  );
}

export default Breadcrumbs;
