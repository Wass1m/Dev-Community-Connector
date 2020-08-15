import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { add_comment } from "../../actions/post";

const CommentForm = ({ add_comment, postID }) => {
  const [formData, setFormData] = useState({ text: "" });

  const { text } = formData;

  const onChange = (e) => {
    setFormData({ text: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    add_comment(postID, formData);
    setFormData({ text: "" });
  };

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Leave a comment...</h3>
      </div>
      <form className="form my-1" onSubmit={(e) => onSubmit(e)}>
        <textarea
          onChange={(e) => onChange(e)}
          name="text"
          cols="30"
          rows="5"
          value={text}
          placeholder="Create a comment"
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

CommentForm.propTypes = {};

export default connect(null, { add_comment })(CommentForm);
