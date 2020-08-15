import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllProfile } from "../../actions/profile";
import ProfileItem from "./ProfileItem";
import { Spinner } from "../Spinner";
const Profiles = ({ getAllProfile, profile: { profiles, loading } }) => {
  useEffect(() => {
    getAllProfile();
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" /> Bros and connect with
            developers
          </p>
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <ProfileItem key={profile._id} profile={profile} />
            ))
          ) : (
            <h4>No profiles found</h4>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getAllProfile })(Profiles);
