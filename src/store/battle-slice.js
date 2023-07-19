import { createSlice } from "@reduxjs/toolkit";
import sampleImage from "../assets/sample.png";
import { getDatabase, ref, set } from "firebase/database";
const INITIAL_CODE =
  "<!-- NOTE: You are coding inside <body> -->\n<style>\n\t.box {\n\t\tbackground: #ff6464;\n\t\twidth: 100px;\n\t\theight: 100px;\n\t}\n</style>\n\n<div class='box'></div>\n";
const QUESTIONS = [
  {
    difficulty: "easy",
    number: "1",
    name: "Finger cross",
    imageSrc: sampleImage,
    accuracy: "---",
    code: INITIAL_CODE,
    colors: ["#4F77FF", "#1038BF"],
  },
  {
    difficulty: "medium",
    number: "2",
    name: "Finger cross",
    imageSrc: sampleImage,
    accuracy: "---",
    code: INITIAL_CODE,
    colors: ["#4F77FF", "#1038BF"],
  },
  {
    difficulty: "hard",
    number: "3",
    name: "Finger cross",
    imageSrc: sampleImage,
    accuracy: "---",
    code: INITIAL_CODE,
    colors: ["#4F77FF", "#1038BF"],
  },
];
/* Function to generate combination of password */
// const generatePassword = () => {
//   let password = "";
//   let str = "abcdefghijklmnopqrstuvwxyz0123456789";

//   for (let i = 1; i <= 4; i++) {
//     let char = Math.floor(Math.random() * str.length + 1);

//     password += str.charAt(char);
//   }

//   return password;
// };
export const battleSlice = createSlice({
  name: "battle",
  initialState: {
    allUsersData: {},
    isLoggedIn: false,
    teamName: "",
    loggedOutCount: 0,
    questions: QUESTIONS,
    securityKey: "cssbattle",
    password: "",
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.teamName = action.payload.teamName;
      state.password = action.payload.password;
      state.securityKey = action.payload.securityKey;
      const questions = [...state.questions];
      if (action.payload.answers !== undefined) {
        for (let i = 0; i < questions.length; i++) {
          if (action.payload.answers[questions[i].number] !== undefined) {
            questions[i].code =
              action.payload.answers[questions[i].number].code;
            questions[i].accuracy =
              action.payload.answers[questions[i].number].accuracy;
          }
        }
      }
      state.questions = questions;
      console.log(state.loggedOutCount);
      state.loggedOutCount = action.payload.loggedOutCount;
    },
    logout(state, action) {
      state.isLoggedIn = false;
      state.teamName = "";
      state.password = "";
      const questions = [...state.questions];
      for (let i = 0; i < questions.length; i++) {
        questions[i].code = INITIAL_CODE;
        questions[i].accuracy = "---";
      }

      state.loggedOutCount = 0;
    },
    submitAnswer(state, action) {
      const questions = [...state.questions];
      const idx = questions.findIndex(
        (question) => question.questionNo === action.payload.questionNo
      );
      questions[idx].code = action.payload.code;
      questions[idx].accuracy = action.payload.accuracy;
      state.questions = questions;
    },
    allUsersData(state, action) {
      state.allUsersData = action.payload;
    },
  },
});
// action thunks has to be created
// for submitting answer
// for logging in
// for logging out
export const battleAction = battleSlice.actions;
export const sendQuestionData = (question) => {
  return async (dispatch, getState) => {
    const sendRequest = async () => {
      const battleInfo = getState().battle;
      const db = getDatabase();
      await set(
        ref(
          db,
          `battle/${battleInfo.teamName}/answers/${question.questionNo}/`
        ),
        {
          accuracy: question.accuracy,
          code: question.code,
          questionNo: question.questionNo,
        }
      );
    };
    try {
      await sendRequest();
      dispatch(
        battleAction.submitAnswer({
          code: question.code,
          accuracy: question.accuracy,
          questionNo: question.questionNo,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};
export const logoutHandler = () => {
  return async (dispatch, getState) => {
    const sendRequest = async () => {
      const battleInfo = getState().battle;
      const db = getDatabase();
      const answers = {};
      for (let i = 0; i < battleInfo.questions.length; i++) {
        const question = battleInfo.questions[i];
        answers[question.number] = {};
        answers[question.number].questionNo = question.number;
        answers[question.number].code = question.code;
        answers[question.number].accuracy = question.accuracy;
      }
      if (battleInfo.teamName.length && battleInfo.isLoggedIn) {
        const loggedOutCount = battleInfo.loggedOutCount + 1;
        await set(ref(db, `battle/${battleInfo.teamName}/`), {
          teamName: battleInfo.teamName,
          password: battleInfo.password,
          securityKey: battleInfo.securityKey,
          loggedOutCount: loggedOutCount,
          answers: answers,
        });
      }
    };
    try {
      await sendRequest();
      dispatch(battleAction.logout());
    } catch (error) {
      console.log(error);
    }
  };
};
export default battleSlice.reducer;
