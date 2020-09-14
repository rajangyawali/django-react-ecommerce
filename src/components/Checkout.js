import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Grid,
  makeStyles,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@material-ui/core";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import Summary from "./Summary";

import axios from "axios";
import { connect } from "react-redux";
import {
  userIDUrl,
  addressUrl,
  addressCreateUrl,
  addressUpdateUrl,
  paymentUrl,
  paymentCreateUrl,
  paymentUpdateUrl,
  orderSuccessUrl,
} from "../constants";
import { setAlert } from "../actions/alert";
import { fetchCart } from "../actions/cart";

const useStyles = makeStyles((theme) => ({
  root: { background: "#e4eaf1" },

  paper: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
    background: "#e4eaf1",
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
    background: "#e4eaf1",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const initialAddress = {
  contact_person: "",
  mobile: 0,
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip_code: 0,
  country: "",
};

const Checkout = ({ setAlert, fetchCart }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [userID, setUserID] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [address, setAddress] = useState([]);
  const [payment, setPayment] = useState([]);
  const [error, setError] = useState(null);
  const [addressFormData, setAddressFormData] = useState([]);
  const [paymentFormData, setPaymentFormData] = useState([]);
  const [addressOperation, setAddressOperation] = useState("add");
  const [paymentOperation, setPaymentOperation] = useState("add");
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [orderID, setOrderID] = useState();

  useEffect(() => {
    handleFetchUserID();
    handleFetchAddress();
    handleFetchPayment();
  }, [showCheckout, checkoutSuccess]);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const handleFetchUserID = () => {
    axios
      .get(userIDUrl, config)
      .then((res) => {
        setUserID(res.data.id);
        setUserName(res.data.name);
        setUserEmail(res.data.email);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleFetchAddress = () => {
    axios
      .get(addressUrl, config)
      .then((res) => {
        setAddress(res.data.results[0]);
        setAddressFormData(res.data.results[0]);
        setShowCheckout(true);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleFetchPayment = () => {
    axios
      .get(paymentUrl, config)
      .then((res) => {
        setPayment(res.data.results[0]);
        setPaymentFormData(res.data.results[0]);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleAddressOnChange = (e) => {
    setAddressFormData({ ...addressFormData, [e.target.name]: e.target.value });
  };

  const handlePaymentOnChange = (e) => {
    setPaymentFormData({ ...paymentFormData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = () => {
    axios
      .post(
        addressCreateUrl,
        {
          user: userID,
          ...addressFormData,
        },
        config
      )
      .then((res) => {
        setAddress(addressFormData);
      })
      .catch((err) => {
        setAlert(
          "Your address couldnot be saved.. Please, try again with valid inputs !!",
          "error"
        );
      });
  };

  const handleUpdateAddress = () => {
    axios
      .patch(
        addressUpdateUrl(address.id),
        {
          ...addressFormData,
        },
        config
      )
      .then((res) => {
        setAddress(addressFormData);
      })
      .catch((err) => {
        setAlert(
          "Your address couldnot be updated.. Please, try again with valid inputs !!",
          "error"
        );
      });
  };

  const handleAddPayment = () => {
    axios
      .post(
        paymentCreateUrl,
        {
          user: userID,
          ...paymentFormData,
        },
        config
      )
      .then((res) => {
        setPayment(paymentFormData);
      })
      .catch((err) => {
        setAlert(
          "Your payment information couldnot be saved.. Please, try again with valid inputs !!",
          "error"
        );
      });
  };

  const handleUpdatePayment = () => {
    axios
      .patch(
        paymentUpdateUrl(payment.id),
        {
          ...paymentFormData,
        },
        config
      )
      .then((res) => {
        setPayment(paymentFormData);
      })
      .catch((err) => {
        setAlert(
          "Your payment information couldnot be updated.. Please, try again with valid inputs !!",
          "error"
        );
      });
  };

  const handleNext = () => {
    if (address) {
      setAddressOperation("update");
    } else {
      setAddressOperation("add");
    }
    if (payment) {
      setPaymentOperation("update");
    } else {
      setPaymentOperation("add");
    }
    setActiveStep(activeStep + 1);
    if (activeStep === 2) {
      if (addressOperation === "add") {
        handleAddAddress();
      } else {
        handleUpdateAddress();
      }
      if (paymentOperation === "add") {
        handleAddPayment();
      } else {
        handleUpdatePayment();
      }
      handleFinalOrder();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const history = useHistory();
  const timeout = (delay) => {
    return new Promise((res) => setTimeout(res, delay));
  };
  const handleFinalOrder = () => {
    axios
      .post(
        orderSuccessUrl,
        {
          user: userID,
          address: address,
          payment: payment,
        },
        config
      )
      .then((res) => {
        setCheckoutSuccess("true");
        setOrderID(res.data["Order ID"]);
        const timer = setTimeout(() => {
          history.push("/");
          window.location.reload(false);
        }, 2000);
        return () => clearTimeout(timer);
      })
      .catch((err) => {
        setActiveStep(activeStep);
        setAlert(
          "Order Failed ! Please try again with valid shipping information or payment information !!",
          "error"
        );
      });
  };

  const steps = ["Shipping Address", "Payment Details", "Confirm Order"];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <AddressForm
            handleOnChange={handleAddressOnChange}
            formData={addressFormData ? addressFormData : []}
          />
        );
      case 1:
        return (
          <PaymentForm
            handleOnChange={handlePaymentOnChange}
            formData={paymentFormData ? paymentFormData : []}
          />
        );
      case 2:
        return (
          <Review
            payment={paymentFormData ? paymentFormData : []}
            address={addressFormData ? addressFormData : []}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  };

  return (
    <Container className={classes.root}>
      {showCheckout ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <Paper className={classes.paper}>
              <Typography component="h1" variant="h4" align="center">
                Checkout
              </Typography>
              <Stepper activeStep={activeStep} className={classes.stepper}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <>
                {activeStep === steps.length ? (
                  <>
                    {checkoutSuccess ? (
                      <>
                        <Typography variant="h5" gutterBottom>
                          Thank you for your order.
                        </Typography>
                        <Typography variant="subtitle1">
                          Your order has been confirmed and your order ID is{" "}
                          {orderID}. We will send you an update when your order
                          has shipped.
                        </Typography>
                      </>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <>
                    {getStepContent(activeStep)}

                    <div className={classes.buttons}>
                      {activeStep !== 0 && (
                        <Button onClick={handleBack} className={classes.button}>
                          Back
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1
                          ? "Place Order"
                          : "Next"}
                      </Button>
                    </div>
                  </>
                )}
              </>
            </Paper>
          </Grid>
          {!checkoutSuccess ? (
            <Grid item xs={12} sm={6} md={6}>
              <Paper className={classes.paper}>
                <Summary />
              </Paper>
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      ) : (
        ""
      )}
    </Container>
  );
};

export default connect(null, { setAlert, fetchCart })(Checkout);
