import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
    fontWeight: "600",
  },
}));

const Review = (props) => {
  const classes = useStyles();
  const {
    contact_person,
    address1,
    address2,
    city,
    state,
    zip_code,
    country,
  } = props.address;

  console.log(props.address);

  const { card_name, card_number, card_type, expiry_date, cvv } = props.payment;

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Shipping
          </Typography>
          <Typography gutterBottom>{contact_person}</Typography>
          <Typography gutterBottom>
            {address1} {address2 ? `or ${address2}` : ""}, {city}
          </Typography>
          <Typography gutterBottom>
            {state}, {country}
          </Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Payment Details
          </Typography>
          <Grid container>
            <React.Fragment>
              <Grid item xs={6}>
                <Typography gutterBottom>{card_type}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>{card_name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>{card_number}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>{expiry_date}</Typography>
              </Grid>
            </React.Fragment>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Review;
