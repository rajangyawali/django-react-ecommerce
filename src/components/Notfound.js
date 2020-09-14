import React from "react";
import { Container, Typography } from "@material-ui/core";

const Notfound = () => {
  return (
    <Container>
      <div style={{ marginBottom: "10rem" }}></div>
      <Typography variant="h4">
        The page you requested is not found !!
      </Typography>
      <div style={{ marginBottom: "12rem" }}></div>
    </Container>
  );
};

export default Notfound;
