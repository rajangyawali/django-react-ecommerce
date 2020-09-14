import React, { useEffect, useState } from "react";
import Product from "./Product";
import Loader from "./Loader";
import { fetchCart } from "../actions/cart";
import { fetchWishList } from "../actions/wishlist";
import { ecommerceImage } from "../ecommerce.png";
import {
  productListUrl,
  orderSummaryUrl,
  addToCartUrl,
  orderProductDeleteUrl,
  addToWishlistUrl,
  wishlistSummaryUrl,
  wishProductDeleteUrl,
} from "../constants";
import axios from "axios";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { Container, Grid, Typography, makeStyles } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { setAlert } from "../actions/alert";
import Banner from "./Banner";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  pagination: {
    marginTop: "5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchInfo: {
    fontSize: "1.5rem",
    textAlign: "center",
    fontStyle: "italic",
    color: "red",
    marginBottom: "10rem",
    marginTop: "5rem",
    marginLeft: "10rem",
  },
}));

const ProductList = ({
  authentication,
  fetchCart,
  fetchWishList,
  setAlert,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [wishProducts, setWishProducts] = useState([]);
  const [totalQty, setTotalQty] = useState(0);
  const [wishListQty, setWishListQty] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    handleFetchData(page);
    handleFetchOrder();
    handleFetchWishList();
  }, [authentication, page]);
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const handleFetchData = (page) => {
    setLoading(true);
    axios
      .get(`${productListUrl}?page=${page}`)
      .then((res) => {
        setData(res.data.results);
        setPageCount(res.data.count);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        setAlert(
          "Error connecting to server !!, Please try again in a while",
          "error"
        );
      });
  };
  const handleFetchOrder = () => {
    setLoading(true);
    axios
      .get(orderSummaryUrl, config)
      .then((res) => {
        setProducts(res.data.order_products);
        setTotalQty(res.data.total_quantity);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const handleFetchWishList = () => {
    setLoading(true);
    axios
      .get(wishlistSummaryUrl, config)
      .then((res) => {
        setWishProducts(res.data.wish_products);
        setWishListQty(res.data.total_quantity);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const handleAddToCart = (slug) => {
    setLoading(true);
    axios
      .post(addToCartUrl, { slug }, config)
      .then((res) => {
        handleFetchOrder();
        fetchCart();
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setAlert("You must be logged in to add products to cart", "error");
        setLoading(false);
      });
  };

  const handleRemoveProduct = (id) => {
    axios
      .delete(orderProductDeleteUrl(id), config)
      .then((res) => {
        handleFetchOrder();
        fetchCart();
      })
      .catch((err) => {
        setError(err);
        setAlert("You must be logged in to remove products from cart", "error");
      });
  };

  const handleAddToWishList = (slug) => {
    axios
      .post(addToWishlistUrl, { slug }, config)
      .then((res) => {
        handleFetchWishList();
        fetchWishList();
      })
      .catch((err) => {
        setError(err);
        setAlert(
          "You must be logged in to add products to favourites",
          "error"
        );
      });
  };

  const handleRemoveFromWishList = (id) => {
    axios
      .delete(wishProductDeleteUrl(id), config)
      .then((res) => {
        handleFetchWishList();
        fetchWishList();
      })
      .catch((err) => {
        setError(err);
        setAlert(
          "You must be logged in to remove products from favourites",
          "error"
        );
      });
  };

  const handleWishList = (id, slug) => {
    if (id.length === 0) {
      handleAddToWishList(slug);
    } else {
      handleRemoveFromWishList(id);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOnChangeSearch = (event) => {
    setSearchQuery(event.target.value);
    setLoading(true);
    axios
      .get(`${productListUrl}?search=${searchQuery}&page=${page}`)
      .then((res) => {
        setData(res.data.results);
        setPageCount(res.data.count);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        setAlert(
          "Error connecting to server !!, Please try again in a while",
          "error"
        );
      });
  };

  const handleProductsCategory = (category) => {
    setCategory(category);
    axios
      .get(`${productListUrl}?category__name=${category}&page=${page}`)
      .then((res) => {
        setData(res.data.results);
        setPageCount(res.data.count);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        setAlert(
          "Error connecting to server !!, Please try again in a while",
          "error"
        );
      });
  };

  let product = data.map((product) => {
    let product_quantity = products
      .map((p) => {
        if (p.product.slug === product.slug) return p.quantity;
      })
      .filter((qty) => qty > 0);
    let product_id = products
      .map((p) => {
        if (p.product.slug === product.slug) return p.id;
      })
      .filter((i) => i > 0);
    let wish_id = wishProducts
      .map((p) => {
        if (p.product.slug === product.slug) return p.id;
      })
      .filter((i) => i > 0);

    return (
      <Grid item xs={12} sm={6} md={4}>
        <Product
          key={product.id.toString()}
          name={product.name}
          description={product.description.slice(0, 150)}
          images={
            product.images[0]
              ? `https://res.cloudinary.com/rajangyawali/${product.images[0].image}`
              : "https://res.cloudinary.com/rajangyawali/image/upload/v1600072791/ecommerce_hczybl.png"
          }
          category={product.category}
          brand={product.brand}
          sale={product.sale ? "Sale" : "New"}
          discount_price={product.discount_price ? product.discount_price : ""}
          price={product.price}
          id={product.id}
          handleAddToCart={() => handleAddToCart(product.slug)}
          handleRemoveProduct={() => handleRemoveProduct(product_id)}
          product_quantity={product_quantity}
          wishColor={wish_id.length > 0 ? "red" : "grey"}
          handleWishList={() => handleWishList(wish_id, product.slug)}
        />
      </Grid>
    );
  });
  return (
    <Container className={classes.root}>
      <Banner
        handleOnChangeSearch={(e) => handleOnChangeSearch(e)}
        searchQuery={searchQuery}
        handleCategory={(category) => handleProductsCategory(category)}
        category={category}
      />
      <Grid container spacing={9}>
        {product}

        {searchQuery && product.length === 0 ? (
          <Typography className={classes.searchInfo}>
            The products you searched are not available !!!
          </Typography>
        ) : (
          ""
        )}
      </Grid>
      {pageCount > 1 && (
        <Pagination
          count={Math.ceil(pageCount / 6)}
          variant="outlined"
          shape="rounded"
          className={classes.pagination}
          page={page}
          onChange={handlePageChange}
        />
      )}
    </Container>
  );
};

ProductList.propTypes = {
  authentication: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  authentication: state.auth.authentication,
});

export default connect(mapStateToProps, {
  fetchCart,
  fetchWishList,
  setAlert,
})(ProductList);
