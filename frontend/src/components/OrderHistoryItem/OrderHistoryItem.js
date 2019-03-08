import React, { Component } from 'react';
import './OrderHistoryItem.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
//import Card from '@material-ui/core/Card';
//import CardActionArea from '@material-ui/core/CardActionArea';
//import CardActions from '@material-ui/core/CardActions';
//import CardContent from '@material-ui/core/CardContent';
//import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  dividerFullWidth: {
    margin: '5px 0 0 ${theme.spacing.unit * 2}px',
  },
  dividerInset: {
    margin: '5px 0 0 ${theme.spacing.unit * 9}px',
  },
});


class OrderHistoryItem extends Component {
  render() {
    const { classes } = this.props;
    return (
      <List className={classes.root}>
  
        <ListItem>
          <ListItemText primary="Date" secondary= {this.props.orderDate} />
        </ListItem>
  
        <Divider component="li" />
  
        <li>
          <Typography className={classes.dividerFullWidth} color="textSecondary">
          </Typography>
        </li>
  
        <ListItem>
          <ListItemText primary= "Name" secondary= {this.props.firstName + ' ' + this.props.lastName} />
        </ListItem>
  
        <Divider component="li" />
  
        <li>
          <Typography className={classes.dividerInset} color="textSecondary">
          </Typography>
        </li>
  
        <ListItem>
          <ListItemText primary="Order ID" secondary= {this.props.oid} />
        </ListItem>
  
        <Divider component="li" />
  
        <li>
          <Typography className={classes.dividerInset} color="textSecondary">
          </Typography>
        </li>
  
        <ListItem>
          <ListItemText primary="Paid" secondary= {this.props.paid} />
        </ListItem>
  
        <Divider component="li" />
  
        <li>
          <Typography className={classes.dividerInset} color="textSecondary">
          </Typography>
        </li>
  
        <ListItem>
          <ListItemText primary="Picked Up" secondary= {this.props.pickedUp} />
        </ListItem>
  
        <Divider component="li" />
  
        <li>
          <Typography className={classes.dividerInset} color="textSecondary">
          </Typography>
        </li>
  
        <ListItem>
          <ListItemText primary="Total Price" secondary= {this.props.totalPrice} />
        </ListItem>
  
  
  
  		</List>
/*      <div>
        <Card className= "card orderHistoryCard">
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h5">
                  Date: {this.props.orderDate}
                </Typography>

                <Typography gutterBottom variant="h5" component="h5">
                  First Name: {this.props.firstName}
                </Typography>

                <Typography gutterBottom variant="h5" component="h5">
                  Last Name: {this.props.lastName}
                </Typography>

                <Typography gutterBottom variant="h5" component="h5">
                  Order ID: {this.props.oid}
                </Typography>

                <Typography gutterBottom variant="h5" component="h5">
                  Paid: {this.props.paid}
                </Typography>

                <Typography gutterBottom variant="h5" component="h5">
                  Picked Up: {this.props.pickedUp}
                </Typography>

                <Typography gutterBottom variant="h5" component="h5">
                  Total Price: ${this.props.totalPrice}
                </Typography>
                
              </CardContent>
            </CardActionArea>
          </Card>
      </div>*/
    )
  }
}

OrderHistoryItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderHistoryItem);
