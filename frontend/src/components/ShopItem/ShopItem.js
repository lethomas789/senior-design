import React, { Component } from 'react';
import './ShopItem.css';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

//component to display product info
export default class ShopItem extends Component {
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
                Price: ${this.props.productPrice}
              </Typography>
              <Typography gutterBottom variant="h5" component="h2">
                Stock: {this.props.stock}
              </Typography>
              <Typography component="p">
                Info: {this.props.productInfo}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Share
            </Button>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Card>
      </div>
    )
  }
}
