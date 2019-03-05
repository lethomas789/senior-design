import React, { Component } from 'react';
import './OrderHistoryItem.css';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

class OrderHistoryItem extends Component {
  render() {
    return (
      <div>
        <Card className= "card">
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Date: {this.props.orderDate}
                </Typography>

                <Typography gutterBottom variant="h5" component="h2">
                  First Name: {this.props.firstName}
                </Typography>

                <Typography gutterBottom variant="h5" component="h2">
                  Last Name: {this.props.lastName}
                </Typography>

                <Typography gutterBottom variant="h5" component="h2">
                  Order ID: {this.props.oid}
                </Typography>

                <Typography gutterBottom variant="h5" component="h2">
                  Paid: {this.props.paid}
                </Typography>

                <Typography gutterBottom variant="h5" component="h2">
                  Picked Up: {this.props.pickedUp}
                </Typography>

                <Typography gutterBottom variant="h5" component="h2">
                  Total Price: {this.props.totalPrice}
                </Typography>
                
              </CardContent>
            </CardActionArea>
          </Card>
      </div>
    )
  }
}

export default OrderHistoryItem;
