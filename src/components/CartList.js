import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchCart } from "../actions/cart";
import PropTypes from "prop-types";
import {
  orderSummaryUrl,
  addToCartUrl,
  orderProductDeleteUrl,
  orderProductUpdateQuantityUrl,
  clearCartUrl,
} from "../constants";
import axios from "axios";
import {
  makeStyles,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  CardActions,
  Typography,
  ButtonGroup,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import AddressForm from "./AddressForm";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    height: "80%",
  },
  heading: {
    marginBottom: "0.5rem",
  },
  table: {
    minWidth: 700,
  },
  tableHead: {
    backgroundColor: "#3f51b5",
  },
  tableHeading: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#fff",
  },
  productCounter: {
    color: "#000000",
    border: "0px",
    width: "50px",
    fontWeight: "700",
  },
  tableTotal: {
    fontSize: "1rem",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "green",
    "&:hover": {
      backgroundColor: "#00b33c",
    },
  },
  cartHeading: {
    paddingTop: "10px",
    paddingBottom: "10px",
    fontSize: "1.8rem",
    fontWeight: "600",
    textAlign: "center",
  },
  cartInfo: {
    paddingTop: "100px",
    paddingBottom: "100px",
    fontSize: "16px",
    textAlign: "center",
    fontStyle: "italic",
    color: "red",
  },
  link: {
    textDecoration: "inherit",
    color: "white",
  },
});

const CartList = ({ authentication, fetchCart }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [error, setError] = useState(null);
  useEffect(() => {
    handleFetchOrder();
    fetchCart();
  }, [authentication]);
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  const handleFetchOrder = () => {
    setLoading(true);
    axios
      .get(orderSummaryUrl, config)
      .then((res) => {
        setProducts(res.data.order_products);
        setTotal(res.data.total);
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
      });
  };

  const handleCartClear = () => {
    axios
      .post(clearCartUrl, config)
      .then((res) => {
        handleFetchOrder();
        fetchCart();
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <Container className={classes.root}>
      <Typography
        className={classes.heading}
        component="h1"
        variant="h4"
        align="center"
      >
        Order Summary
      </Typography>
      {totalQty >= 1 && authentication ? (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="spanning table">
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableHeading} align="center">
                  SN
                </TableCell>
                <TableCell className={classes.tableHeading}>Name</TableCell>
                <TableCell className={classes.tableHeading} align="center">
                  Quantity
                </TableCell>
                <TableCell className={classes.tableHeading} align="center">
                  Color
                </TableCell>
                <TableCell className={classes.tableHeading} align="right">
                  Rate
                </TableCell>
                <TableCell className={classes.tableHeading} align="right">
                  Price
                </TableCell>
                <TableCell className={classes.tableHeading} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((single_product, index) => (
                <TableRow key={single_product.product.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      to={`/products/${single_product.product.id}/`}
                      style={{ textDecoration: "inherit" }}
                    >
                      {single_product.product.name}
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup size="medium" variant="contained">
                      <Button
                        onClick={() =>
                          handleRemoveQuantityFromCart(
                            single_product.product.slug
                          )
                        }
                      >
                        -
                      </Button>
                      <Button class={classes.productCounter}>
                        {single_product.quantity}
                      </Button>
                      <Button
                        onClick={() =>
                          handleAddToCart(single_product.product.slug)
                        }
                      >
                        +
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                  <TableCell align="center">{single_product.color}</TableCell>
                  <TableCell align="right">
                    {single_product.product.price.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {single_product.final_price.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Button>
                      <DeleteIcon
                        color="secondary"
                        fontSize="medium"
                        onClick={() => handleRemoveProduct(single_product.id)}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell />
                <TableCell
                  colSpan={1}
                  className={classes.tableTotal}
                  align="left"
                >
                  Total
                </TableCell>
                <TableCell
                  colSpan={1}
                  className={classes.tableTotal}
                  align="center"
                >
                  {totalQty}
                </TableCell>
                <TableCell className={classes.tableTotal} align="center">
                  -
                </TableCell>
                <TableCell className={classes.tableTotal} align="center">
                  -
                </TableCell>
                <TableCell className={classes.tableTotal} align="right">
                  {total.toFixed(2)}
                </TableCell>
                {/* <TableCell align="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleCartClear()}
                  >
                    <RemoveShoppingCartIcon />
                  </Button>
                </TableCell> */}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography className={classes.cartInfo}>
          Your Cart is currently empty !
        </Typography>
      )}

      <br></br>
      <CardActions className={classes.cardAction} style={{ float: "right" }}>
        <Link to="/" className={classes.link}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ChevronLeftIcon />}
          >
            Continue Shopping
          </Button>
        </Link>
        {totalQty >= 1 ? (
          <Link to="/checkout" className={classes.link}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              endIcon={<ChevronRightIcon />}
            >
              Proceed to Payment
            </Button>
          </Link>
        ) : (
          ""
        )}
      </CardActions>
    </Container>
  );
};

CartList.propTypes = {
  authentication: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  authentication: state.auth.authentication,
});

export default connect(mapStateToProps, { fetchCart })(CartList);
