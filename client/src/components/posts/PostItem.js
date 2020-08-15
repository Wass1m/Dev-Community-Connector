import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import auth from "../../reducers/auth";
import { Link } from "react-router-dom";
import { add_like, remove_like, delete_post } from "../../actions/post";

const PostItem = ({
  auth,
  add_like,
  delete_post,
  remove_like,
  showActions,
  post: { _id, text, name, avatar, user, date, likes, comments },
}) => {
  return (
    <Fragment>
      <div className="post bg-white p-1 my-1">
        <div>
          <a href="profile.html">
            <img className="round-img" src={avatar} alt="" />
            <h4>{name}</h4>
          </a>
        </div>
        <div>
          <p className="my-1">{text}</p>
          <p className="post-date">
            Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
          </p>
          {showActions && (
            <Fragment>
              <button
                type="button"
                className="btn btn-light"
                onClick={(e) => add_like(_id)}
              >
                <i className="fas fa-thumbs-up"></i>
                <span>{likes.length > 0 && <span> {likes.length} </span>}</span>
              </button>
              <button
                type="button"
                className="btn btn-light "
                onClick={(e) => remove_like(_id)}
              >
                <i className="fas fa-thumbs-down"></i>
              </button>
              <Link to={`/post/${_id}`} className="btn btn-primary">
                Discussion{" "}
                <span className="comment-count">
                  {comments.length > 0 && <span> {comments.length} </span>}
                </span>
              </Link>
              {!auth.loading && auth.user._id === user && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={(e) => delete_post(_id)}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {};

const MapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(MapStateToProps, { add_like, remove_like, delete_post })(
  PostItem
);
