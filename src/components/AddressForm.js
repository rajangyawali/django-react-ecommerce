import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";

const AddressForm = (props) => {
  const {
    contact_person,
    mobile,
    address1,
    address2,
    city,
    state,
    zip_code,
    country,
  } = props.formData;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            key="contact_person"
            id="contact_person"
            name="contact_person"
            label="Contact Person"
            fullWidth
            autoComplete="contact_person"
            defaultValue={contact_person}
            onChange={props.handleOnChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            key="mobile"
            id="mobile"
            name="mobile"
            label="Mobile Number"
            fullWidth
            autoComplete="mobile"
            defaultValue={mobile}
            onChange={props.handleOnChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="address1"
            name="address1"
            label="First Address"
            fullWidth
            autoComplete="shipping address-line1"
            defaultValue={address1}
            onChange={props.handleOnChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="address2"
            name="address2"
            label="Second Address"
            fullWidth
            autoComplete="shipping address-line2"
            defaultValue={address2}
            onChange={props.handleOnChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            defaultValue={city}
            onChange={props.handleOnChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="state"
            name="state"
            label="State/Province"
            fullWidth
            defaultValue={state}
            onChange={props.handleOnChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip_code"
            name="zip_code"
            label="Zip / Postal Code"
            fullWidth
            autoComplete="shipping postal-code"
            defaultValue={zip_code}
            onChange={props.handleOnChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            defaultValue={country}
            onChange={props.handleOnChange}
          />
        </Grid>
        {/* <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox color="secondary" name="saveAddress" value="yes" />
            }
            label="Use this address for payment details"
          />
        </Grid> */}
      </Grid>
    </>
  );
};

export default AddressForm;
