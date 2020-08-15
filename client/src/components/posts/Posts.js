import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPosts } from "../../actions/post";
import { Spinner } from "../Spinner";
import PostItem from "./PostItem";
import PostForm from "./PostForm";

const Posts = ({ getPosts, post: { loading, posts } }) => {
  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Posts</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" /> Welcome to the cummunty
          </p>
          <PostForm />
          {posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </Fragment>
      )}
    </Fragment>
  );
};

Posts.propTypes = {};

const mapstateToProps = (state) => ({
  post: state.post,
});

export default connect(mapstateToProps, { getPosts })(Posts);
