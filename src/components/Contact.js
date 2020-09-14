import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { setAlert } from "../actions/alert";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  makeStyles,
  Container,
  Divider,
} from "@material-ui/core";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import { contactMessageUrl } from "../constants";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "80%",
    fontSize: "1rem",
    marginBottom: "22rem",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Contact = ({ setAlert }) => {
  const classes = useStyles();
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { name, email, subject, message } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const emailValidated = email.match(
      "/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/"
    );
    if (emailValidated === false)
      setAlert("Please, provide a valid email address !!", "error");
    else {
      axios
        .post(contactMessageUrl, { name, email, subject, message })
        .then((res) => {
          setAlert("Your message has been sent successfully !!", "success");
          setMessageSuccess(true);
        })
        .catch((err) => {
          setAlert("Error sending message ... Please, try again  !!", "error");
          setMessageSuccess(false);
        });
    }
  };

  if (messageSuccess) return <Redirect to="/" />;

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <Typography variant="h3">Contact Us</Typography>
      <Divider />
      <br />
      <Typography>We provide eCommerce Solution</Typography>

      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ContactMailIcon />
        </Avatar>
        <form
          method="POST"
          className={classes.form}
          noValidate
          onSubmit={(e) => onSubmit(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => onChange(e)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email Address"
                name="email"
                value={email}
                type="email"
                onChange={(e) => onChange(e)}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="subject"
                label="Subject"
                onChange={(e) => onChange(e)}
                autoComplete="subject"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="message"
                label="Message"
                multiline
                onChange={(e) => onChange(e)}
                autoComplete="message"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Send Message
          </Button>
        </form>
      </div>
    </Container>
  );
};

Contact.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { setAlert })(Contact);
