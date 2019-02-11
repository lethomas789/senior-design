import React, { Component } from 'react';
import './CartItem.css';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

//component to display cart objects
export default class CartItem extends Component {
  render() {
    return (
      <div> 
        <Card className= "card">
          <CardActionArea>
            <CardMedia className = "media"/>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {this.props.productName}
              </Typography>
              <Typography gutterBottom variant="h5" component="h2">
                Amount: {this.props.amtPurchased}
              </Typography>
              <Typography gutterBottom variant="h5" component="h2">
                Price: ${this.props.productPrice}
              </Typography>
              <Typography gutterBottom variant="h5" component="h2">
                Total Price: ${this.props.totalPrice}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Remove Item
            </Button>
            <Button size="small" color="primary">
              Add Item
            </Button>
          </CardActions>
        </Card>
      </div>
    )
  }
}
