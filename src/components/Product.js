import React from "react";
import { Link } from "react-router-dom";
import {
  makeStyles,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 360,
  },
  media: {
    maxHeight: "100%",
    paddingTop: "56.25%", // 16:9
    transition: "transform 1s",
    "&:hover": {
      transform: "scale(1.8)",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
    },
  },

  cardContent: {
    backgroundColor: "#d3d5f5",
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
    height: "70px",
  },
  cardAction: {
    backgroundColor: "#d3d5f5",
    display: "flex",
    justifyContent: "space-between",
  },
  linkButton: {
    textDecoration: "inherit",
  },
  addButton: {
    backgroundColor: "green",
    color: "white",
    "&:hover": {
      backgroundColor: "#00b33c",
    },
  },
  avatar: {
    backgroundColor: "#000099",
    width: theme.spacing(7),
    height: theme.spacing(6),
    fontSize: "1rem",
    color: "white",
  },
}));

const Product = (props) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<Avatar className={classes.avatar}>{props.sale}</Avatar>}
        action={
          <IconButton aria-label="add to favorites">
            <FavoriteIcon
              style={{ color: props.wishColor }}
              onClick={props.handleWishList}
            />
          </IconButton>
        }
        className={classes.cardAction}
        title={props.name}
        subheader={props.brand}
      />
      <Link to={`/products/${props.id}/`} className={classes.linkButton}>
        <CardMedia
          className={classes.media}
          image={props.images}
          title={props.name}
        />
      </Link>
      <CardContent className={classes.cardContent}>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          className={classes.cardCategory}
        >
          {props.category}
        </Typography>
        <br />
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          className={classes.cardPrice}
        >
          ${props.discount_price ? props.discount_price : props.price}&nbsp;
          <strike>{props.discount_price ? `$${props.price}` : ""}</strike>
        </Typography>
      </CardContent>
      <CardContent className={classes.cardContent}>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          className={classes.cardDescription}
        >
          {props.description}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardAction}>
        <Link to={`/products/${props.id}/`} className={classes.linkButton}>
          <Button variant="contained" color="primary">
            View
          </Button>
        </Link>
        {props.product_quantity >= 1 ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={props.handleRemoveProduct}
          >
            Remove &nbsp;
            <RemoveShoppingCartIcon />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={props.handleAddToCart}
            className={classes.addButton}
          >
            Add &nbsp;
            <AddShoppingCartIcon />
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Product;
