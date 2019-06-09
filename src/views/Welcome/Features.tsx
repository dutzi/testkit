import React from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { MarginH } from '../../styles';

const Wrapper = styled.div``;

const useStyles = makeStyles({
  media1: {
    height: 463,
  },
  media2: {
    height: 265,
  },
  media3: {
    height: 363,
  },
  media4: {
    height: 291,
  },
  media5: {
    height: 347,
  },
  media6: {
    height: 275,
  },
});

const Features = () => {
  const classes = useStyles();

  const features = [
    {
      image: 'features-1.png',
      media: 'media1',
      title: 'Create Tests',
      description:
        'Create a test, choose the component and sub components it manages',
    },
    {
      image: 'features-2.png',
      media: 'media2',
      title: 'Markdown Editor',
      description: 'Each text area is a Markdown editor',
    },
    {
      image: 'features-3.png',
      media: 'media3',
      title: 'Smart Table',
      description:
        'Tests table supports sort, filter, pagination, multiple items select and much more!',
    },
    {
      image: 'features-4.png',
      media: 'media4',
      title: 'Test Set Overview',
      description: 'Get a quick overview for your test sets',
    },
    {
      image: 'features-5.png',
      media: 'media5',
      title: 'Manage Users',
      description: 'Add or remove users and manage their roles',
    },
    {
      image: 'features-6.png',
      media: 'media6',
      title: 'Import Tests',
      description: 'Import tests from PractiTest or TestLodge',
    },
  ];

  return (
    <Wrapper>
      {features.map((feature, index) => (
        <React.Fragment>
          <Card key={index}>
            <CardActionArea>
              <CardMedia
                className={classes[feature.media]}
                image={feature.image}
                title="Create Tests"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {feature.description}
                </Typography>
              </CardContent>
            </CardActionArea>
            {/* <CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
          <Button size="small" color="primary">
            Learn More
          </Button>
        </CardActions> */}
          </Card>
          <MarginH />
        </React.Fragment>
      ))}
    </Wrapper>
  );
};

export default Features;
