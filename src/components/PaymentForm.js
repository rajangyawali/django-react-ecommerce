import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

const PaymentForm = (props) => {
  const { card_name, card_number, expiry_date, cvv } = props.formData;
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardName"
            name="card_name"
            label="Name on Card"
            fullWidth
            autoComplete="cc-name"
            defaultValue={card_name}
            onChange={props.handleOnChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            name="card_number"
            label="Card Number"
            fullWidth
            autoComplete="cc-number"
            defaultValue={card_number}
            onChange={props.handleOnChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            name="expiry_date"
            label="Expiry Date"
            fullWidth
            autoComplete="cc-exp"
            defaultValue={expiry_date}
            onChange={props.handleOnChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            name="cvv"
            label="CVV"
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="cc-csc"
            defaultValue={cvv}
            onChange={props.handleOnChange}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Remember credit card details for next time"
          />
        </Grid> */}
      </Grid>
    </>
  );
};

export default PaymentForm;
