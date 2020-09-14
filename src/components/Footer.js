import React from "react";
import { makeStyles, Typography, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  footer: {
    marginTop: "12rem",
    paddingTop: "6rem",
    marginLeft: "0",
    marginRight: "0",
    paddingBottom: "6rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "1rem",
    background: "#3f51b5",
    height: "5rem",
    color: "white",
  },
  link: {
    font: "inherit",
    color: "white",
    textDecoration: "inherit",
    cursor: "pointer",
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.footer}>
      <Grid item xs={6} md={8}>
        <Typography variant="body2">
          {"© "}
          Rajan Gyawali &nbsp;
          {new Date().getFullYear()}
        </Typography>
      </Grid>
      <Grid item xs={6} md={4}>
        <Grid container spacing={6}>
          <Grid item xs={5} md={6}>
            <Link to="/contact" className={classes.link}>
              <Typography variant="body2">Contact</Typography>
            </Link>
          </Grid>
          <Grid item xs={5} md={6}>
            <Link to="/about" className={classes.link}>
              <Typography variant="body2">About</Typography>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Footer;
