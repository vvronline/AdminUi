import React, { useEffect, useState } from "react";
import SearchBox from "../SearchBox/SearchBox";
import styles from "./list.module.css";
function List() {
  const [usersCollection, setUsersCollection] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(0);
  const [editDetails, setEditDetails] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [checkedData, setCheckedData] = useState({});
  const [allChecked, setAllChecked] = useState(false);
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setAllChecked(false);
    setCheckedData({});
  }, [currentPage]);

  useEffect(() => {
    SearchedData();
  }, [searchInput]);
  const pageNumbers = [];
  const Pagination = () => {
    const postsPerPage = 10;
    const totalPosts = usersCollection.length;

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
      pageNumbers.push(i);
    }
  };
  const getData = async () => {
    await fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    ).then((res) => {
      res.json().then((res) => {
        setUsersCollection(res);
      });
    });
  };
  Pagination();
  const handleSearch = (value) => {
    SearchedData(value);
  };
  const SearchedData = (value) => {
    setUsersCollection(
      usersCollection.filter((item) => {
        return (
          item.name === value || item.email === value || item.role === value
        );
      })
    );
  };
  const handleResetSearch = () => {
    getData();
    setSearchInput("");
  };

  const RemoveItem = (id) => {
    setUsersCollection(usersCollection.filter((item) => item.id !== id));
  };
  const EditItem = (id, name, email, role) => {
    setEditDetails({ id, name, email, role });

    setEditId(id);
  };
  const handleChange = (e) => {
    setEditDetails({ ...editDetails, [e.target.name]: e.target.value });
  };
  const handleDoneEdit = () => {
    const editedCollection = [];
    for (let user of usersCollection) {
      editedCollection.push(user.id !== editId ? user : editDetails);
    }
    setUsersCollection(editedCollection);
    setEditId(0);
  };
  const handleAllCheckbox = () => {
    const newCollectionCheck = { ...checkedData };
    usersCollection.forEach((item, index) => {
      if (index < currentPage * 10 && index >= (currentPage - 1) * 10)
        newCollectionCheck[item.id] = !allChecked;
    });
    setAllChecked(!allChecked);
    setCheckedData(newCollectionCheck);
  };

  const handleCheckbox = (id) => {
    const status = checkedData;
    status[id] ? (status[id] = false) : (status[id] = true);
    setCheckedData({ ...checkedData, ...status });
  };
  const handleMultipleDelete = () => {
    setUsersCollection(usersCollection.filter((item) => !checkedData[item.id]));
    setCheckedData({});
    setAllChecked(false);
  };

  //console.log('Check', checkedData)
  return (
    <div>
      <SearchBox getSearchValue={handleSearch} resetValue={handleResetSearch} />
      <div className={styles.listMain}>
        <input
          style={{ marginTop: "10%" }}
          type="checkbox"
          checked={allChecked}
          onChange={handleAllCheckbox}
        ></input>
        <div>
          <h3>Name</h3>
        </div>
        <div>
          <h3>Email</h3>
        </div>
        <div>
          <h3>Role</h3>
        </div>
        <div>
          <h3>Actions</h3>
        </div>
      </div>

      <div>
        {usersCollection
          .filter(
            (item, index) =>
              index < currentPage * 10 && index >= (currentPage - 1) * 10
          )
          .map(({ id, name, email, role }) => {
            if (editId == id) {
              return (
                <div className={styles.editInput}>
                  <input
                    type="text"
                    name="name"
                    value={editDetails.name}
                    onChange={(e) => handleChange(e)}
                  />
                  <input
                    type="email"
                    name="email"
                    value={editDetails.email}
                    onChange={(e) => handleChange(e)}
                  />
                  <input
                    type="text"
                    name="role"
                    value={editDetails.role}
                    onChange={(e) => handleChange(e)}
                  />
                  <button onClick={handleDoneEdit}>Done</button>
                </div>
              );
            } else {
              return (
                <div
                  className={styles.listMain}
                  key={id}
                  style={{
                    backgroundColor: checkedData[id] ? "grey" : "white",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checkedData[id] ? true : false}
                    onChange={() => handleCheckbox(id)}
                  ></input>
                  <div>{name}</div>
                  <div>{email}</div>
                  <div>{role}</div>
                  <div>
                    <button
                      className={styles.action_edit_btn}
                      onClick={() => EditItem(id, name, email, role)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.action_delete_btn}
                      onClick={() => RemoveItem(id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            }
          })}
      </div>
      <div className={styles.footer_btn}>
        <button className={styles.footer_delete} onClick={handleMultipleDelete}>
          Delete Multiple
        </button>
        <button
          className={styles.footer_page}
          onClick={() => {
            setCurrentPage(1);
          }}
        >
          &lt;&lt;
        </button>
        <button
          className={styles.footer_page}
          onClick={() => {
            setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage);
          }}
        >
          &lt;
        </button>
        {pageNumbers.map((number) => (
          <button
            style={{
              backgroundColor:
                number === currentPage ? "green" : "rgb(18, 88, 219)",
            }}
            className={styles.footer_page}
            key={number}
            onClick={() => {
              setCurrentPage(number);
            }}
          >
            {number}
          </button>
        ))}
        <button
          className={styles.footer_page}
          onClick={() => {
            setCurrentPage(
              currentPage < pageNumbers.length ? currentPage + 1 : currentPage
            );
          }}
        >
          &gt;
        </button>
        <button
          className={styles.footer_page}
          onClick={() => {
            setCurrentPage(pageNumbers.length);
          }}
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
}

export default List;
