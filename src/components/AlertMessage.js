import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core";
import { mergeClasses } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  alert: {
    width: "60%",
    marginLeft: "20%",
    marginTop: "0",
    marginBottom: "5px",
    display: "flex",
    justifyContent: "center",
  },
}));

const AlertMessage = ({ alerts }) => {
  const classes = useStyles();
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
      <Alert
        key={alert.id}
        severity={alert.alertType}
        className={classes.alert}
      >
        {alert.msg}
      </Alert>
    ))
  );
};

AlertMessage.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(AlertMessage);
