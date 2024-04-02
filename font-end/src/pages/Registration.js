import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Registration() {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(100).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="wrapper">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <h1>REGISTER</h1>
          <ErrorMessage name="username" component="span" />
          <Field
            autocomplate="off"
            id="inputCreatePost"
            name="username"
            placeholder="Ex. John.."
          />
          <ErrorMessage name="password" component="span" />
          <Field
            autocomplate="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="Your password"
          />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
