import { useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import Modal from "../../components/Modal/Modal";
import ChangePasswordModal from "../changePasswordModal/ChangePasswordModal";

import { useSelector, useDispatch } from "react-redux";
import { getUsers, selectUsers } from "../usersTable/usersSlice";

const UserSettingsModal = ({
  userSettingsIsOpen,
  setUserSettingsIsOpen,
  user,
  editUser,
  setEditUser,
  setSelectedUserToAction,
}) => {
  const { pageSize, pageIndex, search, sortBy } = useSelector(selectUsers);
  const dispatch = useDispatch();

  const [changePasswordIsOpen, setChangePasswordIsOpen] = useState(false);

  const handleAfterClose = () => {
    if (editUser) {
      setEditUser(false);
      setSelectedUserToAction("");
    }
  };

  return (
    <Modal
      isOpen={userSettingsIsOpen}
      setModalIsOpen={setUserSettingsIsOpen}
      onAfterClose={handleAfterClose}
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
          if (!editUser) {
            axios
              .post("/api/users", {
                name: values.name,
                password: values.password,
                backend_name: "LDAP",
              })
              .then((response) => {
                // timeout simulate userevent from system
                setTimeout(
                  () => dispatch(getUsers(pageSize, pageIndex, search, sortBy)),
                  7000
                );

                setUserSettingsIsOpen(false);
                setSubmitting(false);
              })
              .catch((error) => {
                console.log(error);
                setSubmitting(false);
              });
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className="inputWrapper">
              <label htmlFor="name">Name:</label>
              <Field
                id="name"
                name="name"
                readOnly={editUser}
                placeholder={editUser ? user : ""}
              />
              {!editUser && errors.name && touched.name ? (
                <span className="hiddenLabel validationError">
                  {errors.name}
                </span>
              ) : null}
            </div>
            {!editUser && (
              <div className="inputWrapper">
                <label htmlFor="password">Password:</label>
                <Field id="password" type="password" name="password" />
                {errors.password && touched.password ? (
                  <span className="hiddenLabel validationError">
                    {errors.password}
                  </span>
                ) : null}
              </div>
            )}
            {!editUser && (
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
            )}
            {!editUser && (
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            )}
          </Form>
        )}
      </Formik>
      {editUser && (
        <button onClick={() => setChangePasswordIsOpen(true)}>
          Change password
        </button>
      )}
      {changePasswordIsOpen && (
        <ChangePasswordModal
          changePasswordIsOpen={changePasswordIsOpen}
          setChangePasswordIsOpen={setChangePasswordIsOpen}
          user={user}
        />
      )}
    </Modal>
  );
};

export default UserSettingsModal;
