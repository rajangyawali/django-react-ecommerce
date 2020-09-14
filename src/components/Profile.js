import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  userIDUrl,
  addressUrl,
  addressCreateUrl,
  addressUpdateUrl,
  addressDeleteUrl,
} from "../constants";
import {
  Grid,
  makeStyles,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  Avatar,
  Typography,
  TableBody,
  Button,
  ButtonGroup,
  Modal,
  Divider,
} from "@material-ui/core";
import EmailIcon from "@material-ui/icons/Email";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { AddCircle } from "@material-ui/icons";
import AddressForm from "./AddressForm";
import { setAlert } from "../actions/alert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: "theme.palette.background.paper",
    marginBottom: "350px",
    alignItems: "center",
  },
  information: {
    fontSize: "1.5rem",
    marginLeft: "0.8rem",
    marginBottom: "1rem",
  },
  table: {
    padding: "0",
    margin: "0",
    border: "1px",
  },
  heading: {
    fontWeight: "600",
  },
  buttonContainer: {
    float: "right",
    marginTop: "2rem",
  },
  addButton: {
    backgroundColor: "green",
    color: "white",
    marginRight: "1rem",
    marginBottom: "2rem",
    "&:hover": {
      backgroundColor: "#00b33c",
    },
  },
  editButton: {
    marginRight: "1rem",
    marginBottom: "2rem",
  },
  deleteButton: {
    marginRight: "1rem",
    marginBottom: "2rem",
  },
  paper: {
    position: "absolute",
    maxWidth: 400,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modal: {
    marginTop: "4rem",
    justifyContent: "center",
  },
}));

const Profile = ({ authentication, setAlert }) => {
  const classes = useStyles();
  const [userID, setUserID] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [address, setAddress] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addressFormData, setAddressFormData] = useState([]);
  const [operation, setOperation] = useState();

  useEffect(() => {
    handleFetchUserID();
    handleFetchAddress();
  }, [authentication, modalOpen, operation]);

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
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleOnChange = (e) => {
    setAddressFormData({ ...addressFormData, [e.target.name]: e.target.value });
  };

  const handleOperation = (operation) => {
    if (operation === "add") {
      setOperation("add");
    } else if (operation === "update") {
      setOperation("update");
    } else {
      setOperation("delete");
    }
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (operation === "add") {
      handleAddAddress();
    }
    if (operation === "update") {
      handleUpdateAddress();
    }
    if (operation === "delete") {
      handleDeleteAddress();
    }
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
        handleModalClose();
        setAddress(addressFormData);
        setAlert("Your address has been saved successfully !!", "success");
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
        handleModalClose();
        setAddress(addressFormData);
        setAlert("Your address has been updated successfully !!", "success");
      })
      .catch((err) => {
        setAlert(
          "Your address couldnot be updated.. Please, try again with valid inputs !!",
          "error"
        );
      });
  };

  const handleDeleteAddress = () => {
    axios
      .delete(addressDeleteUrl(address.id), config)
      .then((res) => {
        setAddress([]);
        setAlert("Your address has been deleted successfully !!", "success");
        handleModalClose();
      })
      .catch((err) => {
        setAlert(
          "Your address couldnot be deleted.. Please, try again !!",
          "error"
        );
      });
  };

  return (
    <Container className={classes.root}>
      {authentication && (
        <Grid container spacing={9}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography className={classes.information}>
              Basic Information
            </Typography>
            <Divider />
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>ID</Avatar>
                </ListItemAvatar>
                {userID}
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                {userName}
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                {userEmail}
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <Modal open={modalOpen} onClose={handleModalClose}>
              <Grid container spacing={0} className={classes.modal}>
                <Grid item xs={12} md={12} className={classes.paper}>
                  <form method="POST" onSubmit={(e) => handleFormSubmit(e)}>
                    {operation === "delete" ? (
                      <Typography variant="h5">
                        Are you sure to delete ?
                      </Typography>
                    ) : (
                      <AddressForm
                        handleOnChange={handleOnChange}
                        formData={address ? address : []}
                      />
                    )}
                    <br></br>
                    <div style={{ float: "right" }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.deleteButton}
                        onClick={handleModalClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.addButton}
                        type="submit"
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </Grid>
              </Grid>
            </Modal>
            {!address && (
              <Button
                variant="contained"
                className={classes.addButton}
                onClick={() => handleOperation("add")}
              >
                Add Address <AddCircle style={{ marginLeft: "1rem" }} />
              </Button>
            )}
            {address && (
              <>
                <Typography className={classes.information}>
                  Shipping Information
                </Typography>
                <Divider />
                <TableContainer
                  className={classes.table}
                  size="small"
                  aria-label="a dense table"
                >
                  <Table aria-label="simple table">
                    <TableBody>
                      <Grid container spacing={0}>
                        <Grid item xs={12} md={6}>
                          <TableRow>
                            <TableCell className={classes.heading}>
                              Contact Person
                            </TableCell>
                            <TableCell>{address.contact_person}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={classes.heading}>
                              Mobile
                            </TableCell>
                            <TableCell>{address.mobile}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={classes.heading}>
                              Address 1
                            </TableCell>
                            <TableCell>{address.address1}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={classes.heading}>
                              Address 2
                            </TableCell>
                            <TableCell>
                              {address.address2 ? address.address2 : "N/A"}
                            </TableCell>
                          </TableRow>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TableRow>
                            <TableCell className={classes.heading}>
                              City
                            </TableCell>
                            <TableCell>{address.city}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={classes.heading}>
                              State/Province
                            </TableCell>
                            <TableCell>{address.state}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={classes.heading}>
                              Zip Code
                            </TableCell>
                            <TableCell>
                              {address.zip_code ? address.zip_code : "N/A"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={classes.heading}>
                              Country
                            </TableCell>
                            <TableCell>{address.country}</TableCell>
                          </TableRow>
                        </Grid>
                      </Grid>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            <ButtonGroup className={classes.buttonContainer}>
              {address ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.editButton}
                    onClick={() => handleOperation("update")}
                  >
                    Update Address
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.deleteButton}
                    onClick={() => handleOperation("delete")}
                  >
                    Delete Address
                  </Button>
                </>
              ) : (
                ""
              )}
            </ButtonGroup>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

Profile.propTypes = {
  authentication: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  authentication: state.auth.authentication,
});

export default connect(mapStateToProps, { setAlert })(Profile);
