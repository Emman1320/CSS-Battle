import { Button, TextField } from "@mui/material";
import "./Login.css";
import React, { Fragment, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase, ref, set } from "firebase/database";
import { battleAction, loginTeam } from "../../store/battle-slice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const battleInfo = useSelector((state) => state.battle);
  const dispatch = useDispatch();
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [error, setError] = useState({
    teamName: false,
    password: false,
    securityKey: false,
  });
  const navigate = useNavigate();
  const login = async (teamData) => {
    const db = getDatabase();
    const isTeamRegistered =
      battleInfo.allUsersData[teamData.teamName] !== undefined;
    if (!isTeamRegistered)
      await set(ref(db, `battle/${teamData.teamName}/`), {
        teamName: teamData.teamName,
        password: teamData.password,
        securityKey: teamData.securityKey,
        loggedOutCount: 0,
        answers: {},
      });
  };
  const submitHandler = async () => {
    setError({ teamName: false, securityKey: false, password: false });
    const teamData = battleInfo.allUsersData[teamName];
    if (
      teamName.length &&
      password.length &&
      securityKey.length &&
      securityKey.trim() === battleInfo.securityKey
    ) {
      if (teamData === undefined || password.trim() === teamData.password) {
        try {
          await login({
            teamName: teamName,
            password: password,
            securityKey: securityKey,
            answers: teamData !== undefined ? teamData.answers : {},
          });
          dispatch(
            battleAction.login({
              teamName: teamName,
              password: password,
              securityKey: securityKey,
              answers: teamData !== undefined ? teamData.answers : {},
              loggedOutCount:
                teamData !== undefined ? teamData.loggedOutCount : 0,
            })
          );
        } catch (error) {
          console.log(error);
        }
        navigate("/questions");
      } else {
        console.log("authentication failed");
      }
    }
    if (
      securityKey.length === 0 ||
      securityKey.trim() !== battleInfo.securityKey
    )
      setError({ teamName: false, securityKey: true, password: false });
    if (teamName.length === 0)
      setError((prev) => {
        return {
          teamName: true,
          securityKey: prev.securityKey,
          password: false,
        };
      });
    if (password.length || (teamData && password.trim() !== teamData.password))
      setError((prev) => {
        return {
          teamName: prev.teamName,
          securityKey: prev.securityKey,
          password: true,
        };
      });
  };
  return (
    <Fragment>
      <Navbar
        teamName={battleInfo.teamName}
        isLoggedIn={battleInfo.isLoggedIn}
        location="login"
      />
      <div className="login-container">
        <div className="login">
          <h2 className="login-header">Login</h2>
          <TextField
            className="login-field"
            label="Team Name"
            variant="filled"
            sx={{ mb: 3 }}
            onChange={(event) => {
              setTeamName(event.target.value);
            }}
            error={error.teamName}
          />
          <TextField
            className="login-field"
            label="Password"
            variant="filled"
            type="password"
            sx={{ mb: 3 }}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            error={error.password}
          />
          <TextField
            className="login-field"
            label="Security Key"
            variant="filled"
            type="test"
            onChange={(event) => {
              setSecurityKey(event.target.value);
            }}
            error={error.securityKey}
          />
          <div className="login-button-container">
            <Button
              onClick={submitHandler}
              className="login-button"
              variant="contained"
            >
              LOGIN
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
