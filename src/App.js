import "./App.css";
import { Fragment, useEffect } from "react";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import BattleArea from "./components/BattleArea/BattleArea";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { battleAction, logoutHandler } from "./store/battle-slice";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCWcEHfggOEh_WshntMiwJ2HJNB0VVM-cg",
  authDomain: "cssbattle-sjce.firebaseapp.com",
  databaseURL: "https://cssbattle-sjce-default-rtdb.firebaseio.com",
  projectId: "cssbattle-sjce",
  storageBucket: "cssbattle-sjce.appspot.com",
  messagingSenderId: "484371487421",
  appId: "1:484371487421:web:90eb5aacea0d09dd9835d4",
  measurementId: "G-772RZVDCV3",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "questions",
    element: <Dashboard />,
  },
  {
    path: "questions/:questionNo",
    element: <BattleArea />,
  },
]);

let wentOut = false;
function App() {
  const dispatch = useDispatch();
  const battleInfo = useSelector((state) => state.battle);
  useEffect(() => {
    window.addEventListener("blur", () => {
      if (battleInfo.teamName.length && !wentOut) {
        dispatch(logoutHandler());
        wentOut = true;
      }
    });
  }, [battleInfo.teamName.length, dispatch]);
  useEffect(() => {
    if (battleInfo.teamName.length) {
      const db = getDatabase();
      const teamDataRef = ref(db, `battle/${battleInfo.teamName}/`);
      onValue(teamDataRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data.loggedOutCount);
        wentOut = false;
        dispatch(battleAction.login(data));
      });
    }
  }, [battleInfo.teamName, dispatch]);
  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `battle/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          dispatch(battleAction.allUsersData(data));
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [dispatch]);
  return (
    <Fragment>
      <RouterProvider router={router} />
    </Fragment>
  );
}

export default App;
