import React, { Fragment, useEffect, useRef, useState } from "react";

import { Button, Tooltip, CircularProgress } from "@mui/material";
import BalanceIcon from "@mui/icons-material/Balance";

import html2canvas from "html2canvas";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";

import sampleImage from "../../assets/sample.png";
import "./BattleArea.css";
import Navbar from "../Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { battleAction, sendQuestionData } from "../../store/battle-slice";

const INITIAL_POS = 100;

const BattleArea = () => {
  const { questionNo } = useParams();
  const dispatch = useDispatch();
  const [sliderPosition, setSliderPosition] = useState(INITIAL_POS);
  const battleInfo = useSelector((state) => state.battle);
  const questionIndex = battleInfo.questions.findIndex(
    (question) => question.number === questionNo
  );
  const currentQuestion = battleInfo.questions[questionIndex];
  const [code, setCode] = useState(currentQuestion.code);
  const [accuracyScore, setAccuracy] = useState(currentQuestion.accuracy);
  const codeInputHandler = React.useCallback((value, viewUpdate) => {
    setCode(value);
  }, []);
  const outputHoverHandler = React.useCallback(
    (event) => {
      let x = (event.clientX - event.target.offsetLeft + 1) / 4;
      x = +x.toFixed(1);
      if (x != sliderPosition) {
        setSliderPosition(x);
      }
    },
    [sliderPosition]
  );
  if (!battleInfo?.isLoggedIn) {
    return <Navigate to="/" />;
  }
  const outputLeaveHandler = (event) => {
    setSliderPosition(INITIAL_POS);
  };
  const generatePixels = async (element, width, height) => {
    let pixels;
    let canvas = await html2canvas(element);
    let canv = canvas.getContext("2d");
    let imageData = canv.getImageData(0, 0, width, height);
    // let img = canvas.toDataURL("image/png");
    // console.log(img);
    pixels = imageData.data;
    return pixels;
  };
  const getElementById = (id) => {
    return document.getElementById(id);
  };
  const submitHandler = async (event) => {
    setAccuracy(<CircularProgress size={"22px"} sx={{ margin: 0 }} />);
    let outputPixelData = await generatePixels(
      getElementById("css-output").contentWindow.document.body,
      400,
      300
    );
    let targetPixelData = await generatePixels(
      getElementById("css-target"),
      400,
      300
    );
    let matchingScore = 0;

    for (let i = 0; i < 400 * 300 * 4; i += 4) {
      if (
        Math.abs(outputPixelData[i] - targetPixelData[i]) <= 1 &&
        Math.abs(outputPixelData[i + 1] - targetPixelData[i + 1]) <= 1 &&
        Math.abs(outputPixelData[i + 2] - targetPixelData[i + 2]) <= 1
      ) {
        matchingScore += 1;
      }
      //  else {
      //   // console.log(`(${outputPixelData[i]}, ${targetPixelData[i]})\n(${outputPixelData[i + 1]}, ${targetPixelData[i + 1]})\n(${outputPixelData[i + 2]}, ${targetPixelData[i + 2]})\n(${outputPixelData[i + 3]}, ${targetPixelData[i + 3]})`);
      // }
    }
    let accuracy = (matchingScore / (4 * 300)).toFixed(2);
    if (accuracy === "100.00") accuracy = 100;
    accuracy = accuracy + "%";
    setAccuracy(accuracy);

    dispatch(sendQuestionData({ questionNo, code, accuracy }));
  };

  return (
    <Fragment>
      <Navbar
        teamName={battleInfo.teamName}
        isLoggedIn={battleInfo.isLoggedIn}
        location="battle-area"
        questionName={currentQuestion.name}
        questionNo={currentQuestion.number}
      />
      <div className="battleArea-container">
        <div className="codingArea">
          <div className="codingArea-header">EDITOR</div>
          <div className="code-mirror-editor">
            <CodeMirror
              value={code}
              style={{
                fontSize: "1rem",
              }}
              height="83vh"
              extensions={[html({ autoCloseTags: true })]}
              onChange={codeInputHandler}
            />
          </div>
        </div>
        <div className="cssDisplay">
          <div className="css-output-container">
            <div className="css-output-header">OUTPUT</div>
            <div className="css-output-target sampleImage">
              <div
                className="css-output"
                style={{ width: `${Math.min(sliderPosition, INITIAL_POS)}%` }}
              >
                <iframe
                  title="my-iframe"
                  width="400px"
                  height="300px"
                  className="iframe-output"
                  id="css-output"
                  srcDoc={
                    "<html style='width:100%; height: 100%'><head></head><body style='width: 100%;height: 100%; margin: 0;'>" +
                    code +
                    "</body></html>"
                  }
                ></iframe>
              </div>
              <div
                className="css-output-layer"
                onMouseMove={outputHoverHandler}
                onMouseLeave={outputLeaveHandler}
              ></div>
            </div>
            <div className="css-output-description">
              <div className="css-output-accuracy">
                <BalanceIcon />
                <div style={{ color: "#00dfa2" }}>{accuracyScore}</div>
              </div>
            </div>
            <div className="css-output-action">
              <Button variant="contained" onClick={submitHandler}>
                SUBMIT
              </Button>
            </div>
          </div>
          <div className="css-target-container">
            <div className="css-target-header">TARGET</div>
            <div className="css-target">
              <img
                className="css-target-image"
                id="css-target"
                src={currentQuestion.imageSrc}
                alt=""
              />
            </div>
            <div className="css-target-colors-container">
              <h4>Colors</h4>
              <div className="css-target-colors">
                {currentQuestion.colors.map((color, index) => (
                  <Chip key={index} color={color} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const Chip = ({ color }) => {
  const chipRef = useRef();
  const [copied, setCopied] = useState(false);
  const chipClickHandler = () => {
    navigator.clipboard.writeText(chipRef.current.textContent);
    setCopied(true);
  };
  return (
    <Tooltip
      className="copied-tooltip"
      title={copied ? "copied" : "click to copy"}
    >
      <div className="chip" ref={chipRef} onClick={chipClickHandler}>
        <div className="chip-color" style={{ backgroundColor: color }}></div>
        <div className="chip-color-hex">{color}</div>
      </div>
    </Tooltip>
  );
};

export default BattleArea;
