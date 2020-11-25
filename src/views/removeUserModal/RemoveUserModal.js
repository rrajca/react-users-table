import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getUsers, selectUsers } from "../usersTable/usersSlice";
import Modal from "../../components/Modal/Modal";

const RemoveUserModal = ({ removeUserIsOpen, setRemoveUserIsOpen, user }) => {
  const { pageSize, pageIndex, search, sortBy } = useSelector(selectUsers);
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");
  const [inputIsValid, setInputIsValid] = useState("");

  const handleInputSubmit = () => {
    if (inputValue === "delete") {
      setInputIsValid(true);
      removeUser();
    } else {
      setInputIsValid(false);
      return;
    }
  };

  const removeUser = () => {
    axios
      .delete("/api/users", {
        params: {
          user,
        },
      })
      .then((response) => {
        setRemoveUserIsOpen(false);
        setTimeout(() => {
          dispatch(getUsers(pageSize, pageIndex, search, sortBy));
        }, 6000);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Modal
      isOpen={removeUserIsOpen}
      setModalIsOpen={setRemoveUserIsOpen}
      height="250px"
      width="560px"
    >
      {inputIsValid === false && (
        <p style={{ color: "red" }}>Entered text is incorrect.</p>
      )}
      <p>
        This will result in immediate termination of user session and permanent
        loss of access to all shares. Once done this operation cannot be
        reversed other than re-creating of this user together with assignment to
        all groups and shares.
      </p>
      <p>
        Because this is a critical action, for better security please type word
        "<span style={{ fontWeight: "bold" }}>delete</span>" into the box below.
      </p>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleInputSubmit}>Submit</button>
    </Modal>
  );
};

export default RemoveUserModal;
