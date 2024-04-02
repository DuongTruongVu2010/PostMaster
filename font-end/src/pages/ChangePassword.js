import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = () => {
    axios
      .put(
        "http://localhost:3001/auth/changepassword",
        { oldPassword: oldPassword, newPassword: newPassword },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        }
      });
  };

  return (
    <div className="changePassword">
      <h1>Change Your Password</h1>
      <div className="wrap_changePassword">
        <input
          className="input_changePassword"
          type="text"
          placeholder="Old Password"
          onChange={(e) => {
            setOldPassword(e.target.value);
          }}
        />
        <input
          className="input_changePassword"
          type="text"
          placeholder="New Password"
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />
        <button className="btn_changePassword" onClick={changePassword}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
