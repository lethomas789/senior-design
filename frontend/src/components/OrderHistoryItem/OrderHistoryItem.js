import React, { Component } from "react";
import "./OrderHistoryItem.css";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
//import Card from '@material-ui/core/Card';
//import CardActionArea from '@material-ui/core/CardActionArea';
//import CardActions from '@material-ui/core/CardActions';
//import CardContent from '@material-ui/core/CardContent';
//import CardMedia from '@material-ui/core/CardMedia';
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  dividerFullWidth: {
    margin: `5px 0 0 ${1 * 2}px`
  },
  dividerInset: {
    margin: `5px 0 0 ${1 * 9}px`
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row"
  }
});

class OrderHistoryItem extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    orderDate: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    paid: PropTypes.string.isRequired,
    pickedUp: PropTypes.string.isRequired,
    totalPrice: PropTypes.string.isRequired,
    clubHistory: PropTypes.bool.isRequired, // viewing club history true/false
    items: PropTypes.array.isRequired
  };

  render() {
    const { classes, items, oid } = this.props;
    return (
      <div className="order-history-item-container">
        <List className={classes.flexContainer}>
          <ListItem>
            <ListItemText primary="Date" secondary={this.props.orderDate} />
          </ListItem>

          <Divider component="li" />

          <li>
            <Typography
              className={classes.dividerFullWidth}
              color="textSecondary"
            />
          </li>

          {/* <ListItem>
          <ListItemText primary= "Name" secondary= {this.props.firstName + ' ' + this.props.lastName} />
        </ListItem> */}

          <ListItem>
            <ListItemText primary="Email" secondary={this.props.email} />
          </ListItem>

          <Divider component="li" />

          <li>
            <Typography
              className={classes.dividerInset}
              color="textSecondary"
            />
          </li>

          <ListItem>
            <ListItemText primary="Order ID" secondary={this.props.oid} />
          </ListItem>

          <Divider component="li" />

          <li>
            <Typography
              className={classes.dividerInset}
              color="textSecondary"
            />
          </li>

          {/* <ListItem>
          <ListItemText primary="Paid" secondary= {this.props.paid} />
        </ListItem> */}

          <Divider component="li" />

          <li>
            <Typography
              className={classes.dividerInset}
              color="textSecondary"
            />
          </li>

          <ListItem>
            <ListItemText primary="Picked Up" secondary={this.props.pickedUp} />
          </ListItem>

          <Divider component="li" />

          <li>
            <Typography
              className={classes.dividerInset}
              color="textSecondary"
            />
          </li>

          <ListItem>
            <ListItemText
              primary="Total"
              secondary={"$" + this.props.totalPrice}
            />
          </ListItem>
        </List>

        <div className="order-summary-container">
          <div className="order-summary-row-title order-summary-row">
            <div>
              <b>Item</b>
            </div>
            <div>
              <b>Price</b>
            </div>
            <div>
              <b>Quantity</b>
            </div>
            <div>
              <b>Total</b>
            </div>
          </div>
          {items.map(item => (
            <div key={item.name} className="order-summary-row">
              <div className="order-summary-item">
                <div>
                  <b>{`${item.name}`}</b>
                </div>

                {item.size && (
                  <div>
                    <b>Size</b>: {`${item.size}`}
                  </div>
                )}
              </div>

              <div>${item.price}</div>

              <div>{item.quantity}</div>

              <div>
                ${Number(Number(item.price) * Number(item.quantity)).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(OrderHistoryItem);
