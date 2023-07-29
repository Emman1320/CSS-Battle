import React from "react";
import "./Navbar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CodeIcon from "@mui/icons-material/Code";
import { Link, useNavigate } from "react-router-dom";
import { ExitToApp, ExitToAppRounded } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  battleAction,
  logoutHandler,
  sendQuestionData,
} from "../../store/battle-slice";
const Navbar = ({
  questionName,
  questionNo,
  isLoggedIn,
  teamName,
  location,
  battleAreaData,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoClickHandler = () => {
    if (location === "battle-area")
      dispatch(sendQuestionData({ ...battleAreaData }));
    navigate("/questions");
  };
  return (
    <div className="navbar">
      <div className="logo-container">
        {/* <Link to={"/questions"}> */}
        <div className="logo" onClick={logoClickHandler}>
          <CodeIcon style={{ fontSize: "42px" }} />
          {/* <img src={logoImage} width="80px" alt="" /> */}
          CRYPTRIX
        </div>
        {/* </Link> */}
        {location === "battle-area" && (
          <div className="dashboard-header">
            <div className="battle-name">{`#${questionNo} ${questionName}`}</div>
          </div>
        )}
      </div>
      <div className="dashboard-items">
        {isLoggedIn && (
          <div className="dashboard-header">
            <DashboardIcon />
            {teamName}
          </div>
        )}
        {isLoggedIn && (
          <div
            className="dashboard-header log-out"
            onClick={() => {
              dispatch(logoutHandler());
              navigate("/");
            }}
          >
            <ExitToAppRounded />
            Log Out
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
