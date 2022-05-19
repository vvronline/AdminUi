import React, { useState } from "react";
import styles from "./searchbox.module.css";

function SearchBox({ getSearchValue, resetValue }) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    getSearchValue(searchText);
  };
  const handleReset = () => {
    resetValue();
    setSearchText("");
  };

  return (
    <div>
      <form className={styles.form_Search}>
        <input
          className={styles.inputbox}
          type="text"
          placeholder="Search by name,email or role"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
      </form>
      <button className={styles.button_Search} onClick={handleSearch}>
        Search
      </button>
      <button className={styles.button_Search} onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}

export default SearchBox;
