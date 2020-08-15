import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { add_post } from "../../actions/post";

const PostForm = ({ add_post }) => {
  const [formData, setFormData] = useState({ text: "" });

  const { text } = formData;

  const onChange = (e) => {
    setFormData({ text: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    add_post(formData);
    setFormData({ text: "" });
  };

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form className="form my-1" onSubmit={(e) => onSubmit(e)}>
        <textarea
          onChange={(e) => onChange(e)}
          name="text"
          cols="30"
          rows="5"
          value={text}
          placeholder="Create a post"
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {};

export default connect(null, { add_post })(PostForm);
