import React, { Component } from "react";
import "./VendorView.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../../store/actions";
import ShopItem from "../ShopItem/ShopItem";
import "./VendorView.css";

class VendorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      vendorName: "",
      bio: "",
      vid: ""
    };
  }

  componentDidMount() {
    //get array of vendor names and information associated with each vendor
    const vendorAPI = "/api/getVendorInfo";

    //get vendor info as an array and store into redux
    axios
      .get(vendorAPI)
      .then(res => {
        if (res.data.success === true) {
          //update array of vendors containing vid, name, bio etc.
          this.props.updateVendors(res.data.vendors);

          //extract param values from URL
          //match object contains parameter values
          const handle = this.props.match.params;
          const apiURL = "/api/getVendorProducts";
          axios
            .get(apiURL, {
              params: {
                vid: handle.vid
              }
            })
            .then(res => {
              var currentVendorName = "";
              var currentVendorBio = "";

              //search for matching vendor id in array of vendors of redux store
              //compare parameter of vid in url to matching vid in array of vendors
              for (let i = 0; i < this.props.vendors.length; i++) {
                if (this.props.vendors[i].vid === handle.vid) {
                  //extract info from matching vid
                  //update component state, list of products from vendor, name of vendor, and bio
                  this.setState({
                    products: res.data.data,
                    vendorName: this.props.vendors[i].vendorName,
                    bio: this.props.vendors[i].bio,
                    vid: this.props.vendors[i].vid
                  });
                  break;
                }
              }
            });
        }
      })
      .catch(err => {
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "danger"
        });
      });
  }

  render() {
    const items = this.state.products.map(result => {
      if (result.hideItem !== true) {
        return (
          <ShopItem
            key={result.pid}
            imageSrc={result.productPicture[0]}
            vendorID={result.vid}
            pid={result.pid}
            productName={result.productName}
            productPrice={result.productPrice}
            stock={result.stock}
            productInfo={result.productInfo}
            displayLink={false}
          />
        );
      }
    });

    return (
      <div className="vendor-items-view-container">
        <h1 className="vendor-items-headers"> {this.state.vendorName} </h1>
        <h3>
          <Link to={`/aboutClub/${this.state.vid}`}> About </Link>
        </h3>
        {/* <h3> Bio: {this.state.bio} </h3> */}

        <div className="vendor-items-container">{items}</div>
      </div>
    );
  }
}

//redux

//dispatch action to reducer
//update items from server to become state of store
const mapDispatchToProps = dispatch => {
  return {
    //update products to view based on selected vendor
    updateProducts: products =>
      dispatch({
        type: actions.GET_PRODUCTS,
        items: products
      }),

    //update vendor names and information
    updateVendors: currentVendors =>
      dispatch({
        type: actions.GET_VENDORS,
        vendors: currentVendors
      })
  };
};

//get items from products state of store
//obtain state from store as props for component
const mapStateToProps = state => {
  return {
    vendor: state.vendor.vendor,
    vendors: state.vendor.vendors
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VendorView);
