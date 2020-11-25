import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import Modal from "../../components/Modal/Modal";

import { useSelector, useDispatch } from "react-redux";
import { getUsers, selectUsers } from "../usersTable/usersSlice";

const AddUserModal = ({ addUserIsOpen, setAddUserIsOpen }) => {
  const { pageSize, pageIndex, search, sortBy } = useSelector(selectUsers);
  const dispatch = useDispatch();

  return (
    <Modal
      isOpen={addUserIsOpen}
      setModalIsOpen={setAddUserIsOpen}
      height="400px"
      width="600px"
    >
      <h1>User settings</h1>
      <Formik
        initialValues={{ name: "", password: "", passwd_confirm: "" }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("Required"),
          password: Yup.string()
            .min(6, "Min 6 characters")
            .required("Required"),
          passwd_confirm: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords do not match")
            .min(6, "Min 6 characters")
            .required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          axios
            .post("/api/users", {
              name: values.name,
              password: values.password,
              backend_name: "LDAP",
            })
            .then((response) => {
              setAddUserIsOpen(false);

              // timeout simulate userevent from system
              setTimeout(
                () => dispatch(getUsers(pageSize, pageIndex, search, sortBy)),
                7000
              );

              setSubmitting(false);
            })
            .catch((error) => {
              console.log(error);
              setSubmitting(false);
            });
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className="inputWrapper">
              <label htmlFor="name">Name:</label>
              <Field id="name" name="name" />
              {errors.name && touched.name ? (
                <span className="hiddenLabel validationError">
                  {errors.name}
                </span>
              ) : null}
            </div>
            <div className="inputWrapper">
              <label htmlFor="password">Password:</label>
              <Field id="password" type="password" name="password" />
              {errors.password && touched.password ? (
                <span className="hiddenLabel validationError">
                  {errors.password}
                </span>
              ) : null}
            </div>
            <div className="inputWrapper">
              <label htmlFor="passwd_confirm">Password confirmation:</label>
              <Field
                id="passwd_confirm"
                type="password"
                name="passwd_confirm"
              />
              {errors.passwd_confirm && touched.passwd_confirm ? (
                <span className="hiddenLabel validationError">
                  {errors.passwd_confirm}
                </span>
              ) : null}
            </div>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddUserModal;
