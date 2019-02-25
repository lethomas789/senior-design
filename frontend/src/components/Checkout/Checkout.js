import React, { Component } from 'react';
import './Checkout.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//styles for checkout button
const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

//calculate total price of user's cart and allow user to checkout
//get user's cart info from state
class Checkout extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid container direction="row">
          <h1> Total: ${this.props.total} </h1>
          <Button variant = "contained" size = "small" color = "primary" className = {classes.margin}> Checkout </Button>
        </Grid>
      </div>
    )
  }
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return{
    items: state.cart.items,
    login: state.auth.login,
    user: state.auth.user,
    total: state.cart.total
  }
}

//redux
//dispatch action to reducer, get user's cart from store
const mapDispatchToProps = dispatch => {
  return{
    updateItems: (response) => dispatch({
      type: actions.GET_CART,
      cart: response
    })
  }
}

Checkout.PropTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Checkout));
