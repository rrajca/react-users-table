import { useState, useRef, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

import Table from "../../components/Table/Table";
import UserSettingsModal from "../userSettingsModal/UserSettingsModal";
import RemoveUserModal from "../removeUserModal/RemoveUserModal";
import { getUsers, selectUsers } from "./usersSlice";

function UsersTable() {
  const { t } = useTranslation();
  const { entries, results, pageCount, isLoading } = useSelector(selectUsers);
  const dispatch = useDispatch();

  const [userSettingsIsOpen, setUserSettingsIsOpen] = useState(false);
  const [removeUserIsOpen, setRemoveUserIsOpen] = useState(false);
  const [selectedUserToAction, setSelectedUserToAction] = useState("");
  const [editUser, setEditUser] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: t("name.label"),
        accessor: "name",
      },
      {
        Header: t("uid.label"),
        accessor: "uid",
      },
      {
        Header: t("options.label"),
        id: "options-column",
        width: 300,
        Cell: ({ row }) => {
          return (
            <Dropdown text="Options" basic labeled button className="icon">
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setUserSettingsIsOpen(true);
                    setEditUser(true);
                    setSelectedUserToAction(row.values.name);
                  }}
                >
                  Edit
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setRemoveUserIsOpen(true);
                    setSelectedUserToAction(row.values.name);
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
    [t]
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
        onClick={() => setUserSettingsIsOpen(true)}
      >
        {t("addUser.button")}
      </button>
      <Table
        columns={columns}
        data={entries}
        dataCount={results}
        fetchData={fetchData}
        loading={isLoading}
        pageCount={pageCount}
      />
      {userSettingsIsOpen && (
        <UserSettingsModal
          userSettingsIsOpen={userSettingsIsOpen}
          setUserSettingsIsOpen={setUserSettingsIsOpen}
          editUser={editUser}
          user={selectedUserToAction}
          setEditUser={setEditUser}
          setSelectedUserToAction={setSelectedUserToAction}
        />
      )}
      {removeUserIsOpen && (
        <RemoveUserModal
          removeUserIsOpen={removeUserIsOpen}
          setRemoveUserIsOpen={setRemoveUserIsOpen}
          user={selectedUserToAction}
          setSelectedUserToAction={setSelectedUserToAction}
        />
      )}
    </>
  );
}

export default UsersTable;
