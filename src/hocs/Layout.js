import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { connect } from "react-redux";
import { authCheckState } from "../actions/auth";

const Layout = (props) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await props.authCheckState();
      } catch (err) {}
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      {props.children}
    </div>
  );
};

export default connect(null, { authCheckState })(Layout);
