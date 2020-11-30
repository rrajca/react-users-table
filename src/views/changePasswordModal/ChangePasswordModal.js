import Modal from "../../components/Modal/Modal";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ChangePasswordModal = ({
  changePasswordIsOpen,
  setChangePasswordIsOpen,
  user,
}) => {
  return (
    <Modal
      isOpen={changePasswordIsOpen}
      setModalIsOpen={setChangePasswordIsOpen}
      //   onAfterClose={handleAfterClose}
      height="250px"
      width="400px"
    >
      <Formik
        initialValues={{ password: "", passwd_confirm: "" }}
        validationSchema={Yup.object().shape({
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
            .put("/api/users", {
              user,
              password: values.password,
            })
            .then((response) => {
              setChangePasswordIsOpen(false);
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

export default ChangePasswordModal;
