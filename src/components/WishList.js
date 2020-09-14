import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchWishList } from "../actions/wishlist";
import PropTypes from "prop-types";
import { wishlistSummaryUrl, wishProductDeleteUrl } from "../constants";
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
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

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

const WishList = ({ authentication, fetchWishList }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [wishProducts, setWishProducts] = useState([]);
  const [wishListTotal, setWishListTotal] = useState(0);
  const [wishListQty, setWishListQty] = useState(0);
  const [error, setError] = useState(null);
  useEffect(() => {
    handleFetchWishList();
    fetchWishList();
  }, [authentication]);
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  const handleFetchWishList = () => {
    setLoading(true);
    axios
      .get(wishlistSummaryUrl, config)
      .then((res) => {
        setWishProducts(res.data.wish_products);
        setWishListQty(res.data.total_quantity);
        setWishListTotal(res.data.total);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const handleRemoveProduct = (id) => {
    axios
      .delete(wishProductDeleteUrl(id), config)
      .then((res) => {
        handleFetchWishList();
        fetchWishList();
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
        My Favourites
      </Typography>
      {wishListQty >= 1 && authentication ? (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="spanning table">
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableHeading} align="center">
                  SN
                </TableCell>
                <TableCell className={classes.tableHeading}>Name</TableCell>

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
              {wishProducts.map((single_product, index) => (
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
                  colSpan={2}
                  className={classes.tableTotal}
                  align="right"
                >
                  Total
                </TableCell>
                <TableCell className={classes.tableTotal} align="right">
                  {wishListTotal.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography className={classes.cartInfo}>
          Your Wishlist is currently empty !
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
      </CardActions>
    </Container>
  );
};

WishList.propTypes = {
  authentication: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  authentication: state.auth.authentication,
});

export default connect(mapStateToProps, { fetchWishList })(WishList);
