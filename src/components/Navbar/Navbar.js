import React from "react";
import "./Navbar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CodeIcon from "@mui/icons-material/Code";
import { Link, useNavigate } from "react-router-dom";
import { ExitToApp, ExitToAppRounded } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { battleAction, logoutHandler } from "../../store/battle-slice";
const Navbar = ({
  questionName,
  questionNo,
  isLoggedIn,
  teamName,
  location,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <div className="logo-container">
        <Link to={"/questions"}>
          <div className="logo">
            <CodeIcon style={{ fontSize: "42px" }} />
            CRYPTRIX
          </div>
        </Link>
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
