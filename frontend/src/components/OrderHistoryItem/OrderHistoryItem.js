import React, { Component } from "react";
import "./OrderHistoryItem.css";
import PropTypes from "prop-types";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@material-ui/core/Checkbox";
import Hidden from "@material-ui/core/Hidden";

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
    pickedUp: PropTypes.bool.isRequired,
    totalPrice: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    vid: PropTypes.string.isRequired,
    updateOrder: PropTypes.func.isRequired,
  };

  state = {
    pickedUp: this.props.pickedUp
  };

  handleUpdateOrder = (oid, vid) => {
    const apiURL = "/api/orders/updateOrder";
    axios
      .patch(apiURL, { withCredentials: true, params: { oid: oid, vid: vid } })
      .then(res => {
        if (res.data.success) {
          this.props.updateOrder(oid, !this.state.pickedUp);
          this.setState(() => ({ pickedUp: !this.state.pickedUp }));

          // this.props.notifier({
          //   title: "Success",
          //   message: res.data.message.toString(),
          //   type: "success"
          // });
        } else {
          this.props.notifier({
            title: "Error",
            message: res.data.message.toString(),
            type: "warning"
          });
        }
      })
      .catch(err => {
        console.log("Error in OrderHistory:", err);
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "danger"
        });
      });
  };

  render() {
    const { classes, items, oid, vid } = this.props;

    return (

      
      
      <div className="order-history-item-container">
      <Hidden mdDown>
     
        <ul className={classes.flexContainer}>
          <ListItem>
            <ListItemText primary="Date" secondary={this.props.orderDate} />
          </ListItem>

          {/* <ListItem>
          <ListItemText primary= "Name" secondary= {this.props.firstName + ' ' + this.props.lastName} />
        </ListItem> */}

          <ListItem>
            <ListItemText primary="Email" secondary={this.props.email} />
          </ListItem>

          <ListItem>
            <ListItemText primary="Order ID" secondary={this.props.oid} />
          </ListItem>

          {/* <ListItem>
          <ListItemText primary="Paid" secondary= {this.props.paid} />
        </ListItem> */}

          <ListItem>
            <ListItemText
              primary="Picked Up"
              secondary={this.state.pickedUp ? "Yes" : "No"}
              style={{ position: "relative" }}
            />
            {vid !== "null" ? (
              <Checkbox
                checked={this.state.pickedUp}
                color="primary"
                value="pickedUp"
                style={{ position: "absolute", right: "100px" }}
                onChange={() => this.handleUpdateOrder(oid, vid)}
              />
            ) : (
              ""
            )}
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Total"
              secondary={"$" + this.props.totalPrice}
            />
          </ListItem>
        </ul>
        </Hidden>
   


        <Hidden lgUp>
        <ul>
          <ListItem>
            <ListItemText primary="Date" secondary={this.props.orderDate} />
          </ListItem>

          {/* <ListItem>
          <ListItemText primary= "Name" secondary= {this.props.firstName + ' ' + this.props.lastName} />
        </ListItem> */}

          <ListItem>
            <ListItemText primary="Email" secondary={this.props.email} />
          </ListItem>

          <ListItem>
            <ListItemText primary="Order ID" secondary={this.props.oid} />
          </ListItem>

          {/* <ListItem>
          <ListItemText primary="Paid" secondary= {this.props.paid} />
        </ListItem> */}

          <ListItem>
            <ListItemText
              primary="Picked Up"
              secondary={this.state.pickedUp ? "Yes" : "No"}
              style={{ position: "relative" }}
            />
            {vid !== "null" ? (
              <Checkbox
                checked={this.state.pickedUp}
                color="primary"
                value="pickedUp"
                style={{ position: "absolute", right: "100px" }}
                onChange={() => this.handleUpdateOrder(oid, vid)}
              />
            ) : (
              ""
            )}
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Total"
              secondary={"$" + this.props.totalPrice}
            />
          </ListItem>
        </ul>
        </Hidden>

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
          {items.map((item, index) => (
            <div key={`${item.name}-${index}`} className="order-summary-row">
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
