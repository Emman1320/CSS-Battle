import React, { Fragment } from "react";
import "./Dashboard.css";
import sampleImage from "../../assets/sample.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Navbar from "../Navbar/Navbar";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

const Dashboard = () => {
  const battleInfo = useSelector((state) => state.battle);
  if (!battleInfo?.isLoggedIn) {
    return <Navigate to="/" />;
  }
  return (
    <Fragment>
      <Navbar
        teamName={battleInfo.teamName}
        isLoggedIn={battleInfo.isLoggedIn}
        location="dashboard"
      />
      <div className="dashboard-container">
        <div className="dashboard-header-container"></div>
        <div className="dashboard">
          {battleInfo.questions.map((question, index) => (
            <CSSQuestion key={index} {...question} />
          ))}
        </div>
      </div>
    </Fragment>
  );
};

const CSSQuestion = ({ difficulty, imageSrc, number, name }) => {
  return (
    <Link to={number}>
      <div className={`dashboard-question ${difficulty}`}>
        <img className="dashboard-question-image" src={imageSrc} alt="" />
        <div className="dashboard-question-description">
          <h3 className="dashboard-question-difficulty">{difficulty}</h3>
          <h4 className="dashboard-question-name">
            <span className="dashboard-question-number">#{number}</span> {name}
          </h4>
        </div>
      </div>
    </Link>
  );
};
export default Dashboard;
