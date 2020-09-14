import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchCart } from "../actions/cart";
import PropTypes from "prop-types";
import { orderSummaryUrl } from "../constants";
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
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    minHeight: "35rem",
    background: "#e4eaf1",
  },
  heading: {
    marginBottom: "0.5rem",
  },
  tableHead: {
    backgroundColor: "#3f51b5",
  },
  tableHeading: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#fff",
  },
  tableTotal: {
    fontSize: "1rem",
    fontWeight: "600",
  },
  link: {
    textDecoration: "inherit",
    color: "white",
    marginRight: "0",
  },
});

const OrderSummary = ({ authentication, fetchCart }) => {
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

  return (
    <Container className={classes.root}>
      <Typography
        className={classes.heading}
        component="h1"
        variant="h4"
        align="center"
      >
        Review Order
      </Typography>
      {totalQty >= 1 && authentication ? (
        <>
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
                    Price
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
                      {single_product.quantity}
                    </TableCell>
                    <TableCell align="center">{single_product.color}</TableCell>

                    <TableCell align="right">
                      {single_product.final_price.toFixed(2)}
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

                  <TableCell className={classes.tableTotal} align="right">
                    {total.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <br></br>
          <CardActions
            className={classes.cardAction}
            style={{ float: "right" }}
          >
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
        </>
      ) : (
        <Typography className={classes.cartInfo}>
          Your Cart is currently empty !
        </Typography>
      )}

      <br></br>
    </Container>
  );
};

OrderSummary.propTypes = {
  authentication: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  authentication: state.auth.authentication,
});

export default connect(mapStateToProps, { fetchCart })(OrderSummary);
