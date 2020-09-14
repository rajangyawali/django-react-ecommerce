import React, { useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { FacebookProvider, Like, Comments } from "react-facebook";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchCart } from "../actions/cart";
import { setAlert } from "../actions/alert";
import {
  productDetailUrl,
  orderSummaryUrl,
  addToCartUrl,
  orderProductDeleteUrl,
  orderProductUpdateQuantityUrl,
  orderProductColorUpdateUrl,
} from "../constants";
import axios from "axios";
import {
  makeStyles,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  ButtonGroup,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  media: {
    maxHeight: "100%",
    paddingTop: "56.25%", // 16:9
    transition: "transform 2s",
    "&:hover": {
      transform: "scale(1.8)",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
    },
  },
  cardInfo: {
    fontSize: "1.8rem",
    fontWeight: "700",
  },
  featuredButton: {
    fontSize: "0.6rem",
    marginRight: "8px",
    cursor: "none",
  },
  arrivalButton: {
    backgroundColor: "green",
    color: "white",
    fontSize: "0.6rem",
    cursor: "none",
    "&:hover": {
      backgroundColor: "#00b33c",
    },
  },
  otherButton: {
    fontSize: "0.9rem",
    marginRight: "10px",
    marginBottom: "0",
    marginTop: "0px",
    cursor: "none",
  },
  continueButton: {
    fontSize: "0.9rem",
    marginRight: "10px",
    marginTop: "10px",
    width: "14rem",
  },
  checkoutButton: {
    fontSize: "0.9rem",
    marginTop: "10px",
    background: "green",
    width: "14rem",
    "&:hover": {
      backgroundColor: "#00b33c",
    },
  },
  addRemoveButton: {
    fontSize: "0.9rem",
    marginRight: "20rem",
    marginTop: "10px",
    width: "14rem",
  },
  incrementDecrementButton: {
    fontSize: "0.9rem",
  },
  cardCategory: {
    fontSize: "16px",
    color: "#0d0d0d",
    fontWeight: "700",
  },
  cardPrice: {
    fontSize: "16px",
    color: "#000099",
    fontWeight: "700",
  },
  cardDescription: {
    fontSize: "13px",
    color: "#000",
  },
  productCounter: {
    color: "#000099",
    width: "50px",
    fontWeight: "700",
  },
  link: {
    textDecoration: "inherit",
    color: "white",
  },
  colorDescription: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "green",
  },
  colorSelection: {
    fontSize: "0.9rem",
    fontStyle: "italic",
  },
  colorLabel: {
    marginRight: "1rem",
    marginTop: "0.5rem",
    marginBottom: "1rem",
    padding: "0.2rem",
    fontSize: "0.6rem",
  },
}));

const ProductDetail = (props) => {
  const { authentication, fetchCart, setAlert } = props;
  const classes = useStyles();
  const [value, setValue] = useState("female");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalQty, setTotalQty] = useState(0);
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    handleFetchProduct();
    handleFetchOrder();
  }, [authentication]);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const handleFetchProduct = () => {
    const {
      match: { params },
    } = props;
    setLoading(true);
    axios
      .get(productDetailUrl(params.id))
      .then((res) => {
        setData(res.data);
        setImages(res.data.images);
        setColors(res.data.colors);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
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

  const handleRemoveQuantityFromCart = (slug) => {
    axios
      .post(orderProductUpdateQuantityUrl, { slug }, config)
      .then((res) => {
        handleFetchOrder();
        fetchCart();
      })
      .catch((err) => {
        setError(err);
        setAlert("You must be logged in to remove products from cart", "error");
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

  const handleUpdateProductColor = (slug, color) => {
    setLoading(true);
    axios
      .post(orderProductColorUpdateUrl, { slug, color }, config)
      .then((res) => {
        setLoading(false);
        handleFetchOrder();
      })
      .catch((err) => {
        setError(err);
        setAlert("You must be logged in to update color for product", "error");
        setLoading(false);
      });
  };

  // Returning the first element of an array
  const first = (array, n) => {
    if (array == null) return void 0;
    if (n == null) return array[0].image;
    if (n < 0) return [];
    if (n > 3) return array.slice(3, n);
    return array.slice(1, 3);
  };

  // Assigning API Data to product
  const product = data;

  // Retrieving Main Image to the product
  const firstImage = first(data.images);

  // Retrieving Other Two Images
  const twoProductImages = first(images, 3).map((im, i) => {
    return (
      <Grid item xs={6} sm={6} md={12}>
        <Card className={classes.root}>
          <CardMedia
            key={im.id}
            className={classes.media}
            image={
              im.image
                ? `https://res.cloudinary.com/rajangyawali/${im.image}`
                : "https://res.cloudinary.com/rajangyawali/image/upload/v1600072791/ecommerce_hczybl.png"
            }
          />
        </Card>
      </Grid>
    );
  });

  // Retrieving Remaining Images
  const otherProductImages = first(images, 10).map((im, i) => {
    return (
      <Grid item xs={6} sm={6} md={4}>
        <Card className={classes.root}>
          <CardMedia
            key={im.id}
            className={classes.media}
            image={
              im.image
                ? `https://res.cloudinary.com/rajangyawali/${im.image}`
                : "https://res.cloudinary.com/rajangyawali/image/upload/v1600072791/ecommerce_hczybl.png"
            }
          />
        </Card>
      </Grid>
    );
  });

  // Retrieving Quantity of the Product in Cart
  const product_quantity = products
    .map((p) => {
      if (p.product.slug === product.slug) return p.quantity;
    })
    .filter((qty) => qty > 0);

  // Retrieving Product ID of the product
  const product_id = products
    .map((p) => {
      if (p.product.slug === product.slug) return p.id;
    })
    .filter((i) => i > 0);

  // Retrieving color of the product from cart
  const product_color = products
    .map((p) => {
      if (p.product.slug === product.slug) return p.color;
    })
    .filter((i) => i !== undefined);

  const displayCounter = product_quantity >= 1;
  return (
    <Container className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={7}>
          {twoProductImages.length >= 1 ? (
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={8}>
                <Card className={classes.root}>
                  <CardMedia
                    className={classes.media}
                    image={
                      firstImage
                        ? `https://res.cloudinary.com/rajangyawali/${firstImage}`
                        : "https://res.cloudinary.com/rajangyawali/image/upload/v1600072791/ecommerce_hczybl.png"
                    }
                    title={product.name}
                  />
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <Grid container spacing={1}>
                  {twoProductImages}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Grid container spacing={1}>
                  {otherProductImages}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Card className={classes.root}>
              <CardMedia
                className={classes.media}
                image={firstImage}
                title={product.name}
              />
            </Card>
          )}
          <CardContent className={classes.cardContent}>
            <FacebookProvider appId="313338243228298">
              <Like
                href={`https://gyawali-ecommerce.herokuapp.com/products/${product.id}`}
                colorScheme="dark"
                showFaces
                share
              />
            </FacebookProvider>
            <br></br>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.cardDescription}
            >
              {product.description}
            </Typography>
            <br></br>
            <Divider />
            <FacebookProvider appId="313338243228298">
              <Comments
                href={`https://gyawali-ecommerce.herokuapp.com/products/${product.id}`}
              />
            </FacebookProvider>
          </CardContent>
        </Grid>
        <Grid item xs={12} sm={12} md={5}>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.cardInfo}>
              Product Description
            </Typography>
            <br></br>
            <Typography>
              {product.featured && (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.featuredButton}
                >
                  Featured
                </Button>
              )}
              {product.sale ? (
                <Button variant="contained" className={classes.arrivalButton}>
                  On Sale
                </Button>
              ) : (
                <Button variant="contained" className={classes.arrivalButton}>
                  New Arrivals
                </Button>
              )}
            </Typography>
            <br></br>
            <Typography variant="h5">{product.name}</Typography>
            <Divider />
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.cardCategory}
            >
              {product.category}
              <Button color="secondary" className={classes.otherButton}>
                {product.brand}
              </Button>
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.cardPrice}
            >
              ${product.discount_price ? product.discount_price : product.price}
              &nbsp;
              <strike>
                {product.discount_price ? `$${product.price}` : ""}
              </strike>
            </Typography>
          </CardContent>

          {colors.length >= 1 && displayCounter && (
            <CardContent>
              <Typography variant="h6" className={classes.colorDescription}>
                Colors Available
              </Typography>
              {colors.map((color) => {
                return (
                  <Button
                    variant="contained"
                    className={classes.colorLabel}
                    style={{ background: color.color, color: "#d9d9d9" }}
                    onClick={() =>
                      handleUpdateProductColor(product.slug, color.color)
                    }
                  >
                    {color.color}
                  </Button>
                );
              })}
              <Typography className={classes.colorSelection}>
                You current choice: {product_color}
              </Typography>
            </CardContent>
          )}
          <CardContent>
            <Divider />
            <br></br>
            <ButtonGroup
              size="medium"
              variant="contained"
              style={{ marginRight: "15rem" }}
            >
              <Button
                className={classes.incrementDecrementButton}
                onClick={() => handleAddToCart(product.slug)}
              >
                +
              </Button>
              {displayCounter && (
                <Button disabled class={classes.productCounter}>
                  {product_quantity}
                </Button>
              )}
              {displayCounter && (
                <Button
                  onClick={() => handleRemoveQuantityFromCart(product.slug)}
                  className={classes.incrementDecrementButton}
                >
                  -
                </Button>
              )}
            </ButtonGroup>
            <ButtonGroup>
              {product_quantity >= 1 ? (
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.addRemoveButton}
                  onClick={() => handleRemoveProduct(product_id)}
                >
                  Remove from Cart &nbsp;
                  <RemoveShoppingCartIcon />
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.addRemoveButton}
                  onClick={() => handleAddToCart(product.slug)}
                >
                  Add to Cart &nbsp;
                  <AddShoppingCartIcon />
                </Button>
              )}
            </ButtonGroup>
            <ButtonGroup>
              <Link to="/" className={classes.link}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.continueButton}
                >
                  Continue Shopping
                </Button>
              </Link>
            </ButtonGroup>
            <ButtonGroup>
              <Link to="/order-summary" className={classes.link}>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.checkoutButton}
                >
                  Cart Summary
                </Button>
              </Link>
            </ButtonGroup>
          </CardContent>
        </Grid>
      </Grid>
    </Container>
  );
};

ProductDetail.propTypes = {
  authentication: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  authentication: state.auth.authentication,
});

export default connect(mapStateToProps, { fetchCart, setAlert })(ProductDetail);
