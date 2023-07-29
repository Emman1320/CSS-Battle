import React, { Fragment } from "react";
import "./Dashboard.css";
import Navbar from   "../Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { battleAction } from "../../store/battle-slice";
import { Box, Modal, Typography } from "@mui/material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "0px solid #13181c",
  outline: "0",
  boxShadow: 24,
  p: 4,
};
const Dashboard = () => {
  const battleInfo = useSelector((state) => state.battle);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(battleAction.toggleLoggedOutModal({ showModal: false }));
  };
  if (!battleInfo?.isLoggedIn) {
    return <Navigate to="/" />;
  }
  return (
    <Fragment>
      <Modal
        open={Boolean(battleInfo.showLoggedOutModal)}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Warning
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            If you logout one more time your security key would be lost!
          </Typography>
        </Box>
      </Modal>
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
