import React from "react";
import { makeStyles, Typography, Container, Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: "1rem",
    marginBottom: "22rem",
  },
}));
const About = () => {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <Typography variant="h3">About Us</Typography>
      <Divider />
      <br />
      <Typography>We provide eCommerce Solution</Typography>
    </Container>
  );
};

export default About;
