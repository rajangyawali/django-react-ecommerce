import React, { useEffect, useState } from "react";
import clsx from "clsx";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import { authCheckState, logout } from "../actions/auth";
import { fetchCart } from "../actions/cart";
import { fetchWishList } from "../actions/wishlist";
import PropTypes from "prop-types";
import { config } from "../utils";
import { connect } from "react-redux";
import { orderSummaryUrl, wishlistSummaryUrl } from "../constants";
import {
  makeStyles,
  useTheme,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Button,
  ListItem,
  ListItemText,
  useMediaQuery,
  Badge,
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { AccountCircle } from "@material-ui/icons/";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AlertMessage from "./AlertMessage";

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    background: "#3f51b5",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    "& : hover": {
      background: "#3f51b5",
    },
  },
  menuContainer: {
    margin: "10px",
    background: "#3f51b5",
    "& : hover": {
      background: "#3f51b5",
    },
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: "#9589CE",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const Navbar = ({
  authentication,
  logout,
  numberOfCartProducts,
  numberOfWishListProducts,
  fetchCart,
  fetchWishList,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(false);
  const [totalQty, setTotalQty] = useState(0);
  const [wishListQty, setWishListQty] = useState(0);

  useEffect(() => {
    handleFetchOrder();
    handleFetchWishProducts();
    fetchCart();
    fetchWishList();
    authCheckState();
  }, [isMobile, authentication]);
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  const handleFetchOrder = () => {
    axios
      .get(orderSummaryUrl, config)
      .then((res) => {
        setTotalQty(res.data.total_quantity);
      })
      .catch((err) => {});
  };

  const handleFetchWishProducts = () => {
    axios
      .get(wishlistSummaryUrl, config)
      .then((res) => {
        setWishListQty(res.data.total_quantity);
      })
      .catch((err) => {});
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              ""
            )}
            <Typography variant="h6" noWrap className={classes.title}>
              <Link
                to="/"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                Ecommerce
              </Link>
            </Typography>
            {authentication && (
              <>
                <Link
                  to="/order-summary"
                  style={{ color: "inherit", textDecoration: "inherit" }}
                >
                  <Badge
                    badgeContent={numberOfCartProducts}
                    color="primary"
                    style={{ marginRight: "50px" }}
                  >
                    <ShoppingCartIcon size="large" />
                  </Badge>
                </Link>
                <Link
                  to="/wishlist-summary"
                  style={{ color: "inherit", textDecoration: "inherit" }}
                >
                  <Badge
                    badgeContent={numberOfWishListProducts}
                    color="primary"
                    style={{ marginRight: "50px" }}
                  >
                    <FavoriteIcon size="large" />
                  </Badge>
                </Link>
              </>
            )}
            {isMobile ? (
              ""
            ) : (
              <>
                {authentication && (
                  <div>
                    <Button
                      variant="contained"
                      className={classes.menuContainer}
                      color="primary"
                      onClick={logout}
                    >
                      Logout
                    </Button>
                    <Link
                      to="/profile"
                      style={{ color: "inherit", textDecoration: "inherit" }}
                    >
                      <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                      >
                        <AccountCircle />
                      </IconButton>
                    </Link>
                  </div>
                )}
                {!authentication && (
                  <div>
                    <Link
                      to="/login"
                      style={{ color: "inherit", textDecoration: "inherit" }}
                    >
                      <Button
                        variant="contained"
                        className={classes.menuContainer}
                        color="primary"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link
                      to="/signup"
                      style={{ color: "inherit", textDecoration: "inherit" }}
                    >
                      <Button
                        variant="contained"
                        className={classes.menuContainer}
                        color="primary"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div
            className={classes.drawerHeader}
            style={{
              background: "#3f51b5",
            }}
          >
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List onClick={handleDrawerClose}>
            {authentication ? (
              <>
                <ListItem button className={classes.menuButton}>
                  <Link
                    to="/profile"
                    style={{ color: "inherit", textDecoration: "inherit" }}
                  >
                    <IconButton
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                  </Link>
                </ListItem>
                <ListItem
                  button
                  className={classes.menuButton}
                  onClick={() => logout()}
                >
                  Logout
                </ListItem>
                <ListItem button>
                  <Link
                    to="/order-summary"
                    style={{ color: "inherit", textDecoration: "inherit" }}
                  >
                    Cart Summary
                  </Link>
                </ListItem>
                <ListItem button>
                  <Link
                    to="/wishlist-summary"
                    style={{ color: "inherit", textDecoration: "inherit" }}
                  >
                    Favourite Products
                  </Link>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button className={classes.menuButton}>
                  <Link
                    to="/login"
                    style={{ color: "inherit", textDecoration: "inherit" }}
                  >
                    Login
                  </Link>
                </ListItem>
                <ListItem button className={classes.menuButton}>
                  <Link
                    to="/signup"
                    style={{ color: "inherit", textDecoration: "inherit" }}
                  >
                    Sign Up
                  </Link>
                </ListItem>
              </>
            )}
            <ListItem button>
              <Link
                to="/contact"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                Contact
              </Link>
            </ListItem>
            <ListItem button>
              <Link
                to="/about"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                About Us
              </Link>
            </ListItem>
          </List>
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
        </main>
      </div>
      <AlertMessage />
    </>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  fetchCart: PropTypes.func.isRequired,
  fetchWishList: PropTypes.func.isRequired,
  authCheckState: PropTypes.func.isRequired,
  authentication: PropTypes.bool,
  numberOfCartProducts: PropTypes.bool,
  numberOfWishListProducts: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  authentication: state.auth.authentication,
  numberOfCartProducts: state.cart.numberOfCartProducts,
  numberOfWishListProducts: state.wishlist.numberOfWishListProducts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart()),
    fetchWishList: () => dispatch(fetchWishList()),
    authCheckState: () => dispatch(authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
