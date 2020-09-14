import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoriesUrl, featuredProductsUrl } from "../constants";
import axios from "axios";
import {
  Grid,
  InputBase,
  Typography,
  fade,
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Card,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import Carousel from "react-material-ui-carousel";
import SearchIcon from "@material-ui/icons/Search";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: "2rem",
  },
  toolbar: {
    height: "3rem",
    background: "#3f51b5",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  search: {
    marginTop: "2rem",
    marginBottom: "0",
    position: "relative",
    float: "right",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginBottom: "2rem",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  carousel: {
    display: "flex",
  },
  category: {
    marginTop: "0.5rem",
    maxWidth: 360,
    color: "white",
    background: "#3f51b5",
    marginRight: "0.2rem",
    height: "30rem",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  card: {
    marginTop: "0.5rem",
    height: "30rem",
  },
  media: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    borderTopLeftRadius: "1rem",
    marginTop: "25rem",
    background: "black",
    color: "white",
    padding: "1rem",
    float: "right",
  },
  name: {
    fontSize: "1.5rem",
    fontWeight: "700",
  },
  price: {
    color: "#0FFFFF",
    fontSize: "1rem",
  },
}));

const Banner = ({
  searchQuery,
  handleOnChangeSearch,
  handleCategory,
  category,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([{}, {}, {}, {}]);

  useEffect(() => {
    fetchCategories();
    fetchFeaturedProducts();
  }, [searchQuery, category]);

  const fetchCategories = () => {
    axios
      .get(categoriesUrl)
      .then((res) => {
        setCategories(res.data.results);
      })
      .catch((err) => {});
  };

  const fetchFeaturedProducts = () => {
    axios
      .get(featuredProductsUrl)
      .then((res) => {
        setFeaturedProducts(res.data.results);
      })
      .catch((err) => {});
  };

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Categories
          </Typography>
          <Grid className={classes.search}>
            <form>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                name="search"
                inputProps={{ "aria-label": "search" }}
                onChange={handleOnChangeSearch}
              />
            </form>
          </Grid>
        </Toolbar>
      </AppBar>
      {searchQuery ? (
        ""
      ) : (
        <Grid className={classes.carousel}>
          {open && (
            <Grid item xs={12} sm={4} md={3}>
              <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
                className={classes.category}
              >
                <List component="div" disablePadding>
                  {categories.map((category, i) => {
                    return (
                      <ListItem button key={i}>
                        <ListItemText
                          primary={category.name}
                          onClick={() => handleCategory(category.name)}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </Grid>
          )}
          {open ? (
            <Grid item xs={12} sm={8} md={9}>
              <Carousel interval="3000">
                {featuredProducts.map((product) => (
                  <FeaturedProduct key={product.id} product={product} />
                ))}
              </Carousel>
            </Grid>
          ) : (
            <Grid item xs={12} sm={12} md={12}>
              <Carousel interval="3000">
                {featuredProducts.map((product) => (
                  <FeaturedProduct key={product.id} product={product} />
                ))}
              </Carousel>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
};

const FeaturedProduct = (props) => {
  const classes = useStyles();
  const {
    id,
    name,
    description,
    images,
    price,
    discount_price,
    brand,
  } = props.product;
  return (
    <Card className={classes.card}>
      <Link to={`/products/${id}`}>
        <CardMedia
          className={classes.media}
          image={
            images
              ? `https://res.cloudinary.com/rajangyawali/${images[0].image}`
              : "https://res.cloudinary.com/rajangyawali/image/upload/v1600072791/ecommerce_hczybl.png"
          }
          title={name}
        >
          <Typography className={classes.content}>
            <Typography className={classes.name}>{name}</Typography>
            <Typography className={classes.price}>
              ${discount_price > 0 ? discount_price : price}{" "}
              {brand ? `| ${brand}` : ""}
            </Typography>
          </Typography>
        </CardMedia>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {description ? description.slice(0, 50) : ""}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
};

export default Banner;
