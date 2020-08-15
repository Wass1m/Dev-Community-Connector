import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPostById } from "../../actions/post";
import PostItem from "./PostItem";
import { Spinner } from "../Spinner";
import { Link } from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const Post = ({ getPostById, match, post: { post, loading } }) => {
  useEffect(() => {
    getPostById(match.params.id);
  }, [getPostById]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link className="btn btn-light" to="/posts">
        Back to posts
      </Link>
      <PostItem post={post} showActions={false}></PostItem>
      <CommentForm postID={post._id} />
      {post.comments.map((comment) => (
        <CommentItem key={comment._id} postId={post._id} comment={comment} />
      ))}
    </Fragment>
  );
};

Post.propTypes = {};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPostById })(Post);
