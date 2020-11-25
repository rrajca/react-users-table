import { useState, useRef, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "semantic-ui-react";

import Table from "../../components/Table/Table";
import AddUserModal from "../addUserModal/AddUserModal";
import RemoveUserModal from "../removeUserModal/RemoveUserModal";
import { getUsers, selectUsers } from "./usersSlice";

function UsersTable() {
  const { entries, results, pageCount, isLoading } = useSelector(selectUsers);
  const dispatch = useDispatch();

  const [addUserIsOpen, setAddUserIsOpen] = useState(false);
  const [removeUserIsOpen, setRemoveUserIsOpen] = useState(false);
  const [selectedUserToRemove, setSelectedUserToRemove] = useState("");

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "uid",
        accessor: "uid",
      },
      {
        Header: "Options",
        id: "options-column",
        width: 300,
        Cell: ({ row }) => {
          return (
            <Dropdown text="Options" basic labeled button className="icon">
              <Dropdown.Menu>
                <Dropdown.Item disabled>Edit</Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setRemoveUserIsOpen(true);
                    setSelectedUserToRemove(row.values.name);
                  }}
                >
                  Remove
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],
    []
  );

  const fetchIdRef = useRef(0);

  const fetchData = useCallback(
    ({ pageSize, pageIndex, search, sortBy }) => {
      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current) {
        dispatch(getUsers(pageSize, pageIndex, search, sortBy));
      }
    },
    [dispatch]
  );

  return (
    <>
      <button
        style={{ marginRight: "20px" }}
        onClick={() => setAddUserIsOpen(true)}
      >
        Add user
      </button>
      <Table
        columns={columns}
        data={entries}
        dataCount={results}
        fetchData={fetchData}
        loading={isLoading}
        pageCount={pageCount}
      />
      {addUserIsOpen && (
        <AddUserModal
          addUserIsOpen={addUserIsOpen}
          setAddUserIsOpen={setAddUserIsOpen}
        ></AddUserModal>
      )}
      {removeUserIsOpen && (
        <RemoveUserModal
          removeUserIsOpen={removeUserIsOpen}
          setRemoveUserIsOpen={setRemoveUserIsOpen}
          user={selectedUserToRemove}
        ></RemoveUserModal>
      )}
    </>
  );
}

export default UsersTable;
