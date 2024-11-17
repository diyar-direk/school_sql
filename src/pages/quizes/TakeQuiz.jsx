import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../../context/Context";
import "./quiz.css";
const TakeQuiz = () => {
  const { id } = useParams();
  const context = useContext(Context);

  const token = context?.userDetails.token;
  const userDetails = context?.userDetails.userDetails;
  const name =
    userDetails &&
    `${userDetails.firstName} ${userDetails.middleName} ${userDetails.lastName}`;
  const [data, setData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [initialTime, setInitialTime] = useState(0); // Store the database value
  const [time, setTime] = useState(0); // Countdown timer
  const [remainingTime, setRemainingTime] = useState("");
  const timerStarted = useRef(false); // Ref to track if the timer has started

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setQuestions(res.data.data.questions);
        const durationInSeconds = res.data.data.duration * 60;
        setInitialTime(durationInSeconds);
        if (!timerStarted.current) {
          setTime(durationInSeconds);
          timerStarted.current = true;
        }
      });
  }, []);

  // useEffect(() => {
  //   if (timerStarted.current) {
  //     const interval = setInterval(() => {
  //       setTime((prevTime) => {
  //         if (prevTime <= 1) {
  //           clearInterval(interval);
  //           return 0;
  //         }
  //         return prevTime - 1;
  //       });
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [time]);

  // useEffect(() => {
  //   const hours = Math.floor(time / 3600);
  //   const minutes = Math.floor((time % 3600) / 60);
  //   const seconds = time % 60;
  //   setRemainingTime(
  //     `${hours.toString().padStart(2, "0")}:${minutes
  //       .toString()
  //       .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  //   );
  // }, [time]);

  console.log(data);

  // const createQus =questions?.map(e=>{
  //   return
  // })

  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <div className="center between quiz-title">
            <h1 className="title">{data.subjectId?.name}</h1>
            <div>
              <h2 className="text-capitalize">{name}</h2>
              <h3 className="text-capitalize">{data.duration}</h3>
            </div>
          </div>
          <h2 className="time gap-10 center text-capitalize">
            remaining time : <span>{remainingTime}</span>
          </h2>

          <div className="questions-space">
            <h3>Q-1</h3>
            <div className="center wrap justify-start gap-10">
              <h2 className="flex-1">what is dasdsa?</h2>
              <div className="flex gap-10">
                <i className="fa-solid fa-check true"></i>
                <i className="fa-solid fa-xmark false"></i>
              </div>
            </div>
            <h3>Q-2</h3>
            <div className="center wrap justify-start gap-10">
              <h2 className="flex-1">what is dasdsa?</h2>
              <article className="w-100">
                <h4>1: ol</h4>
                <h4>1: ol</h4>
                <h4>1: ol</h4>
              </article>
            </div>
          </div>

          <button className="btn"> finish the quiz </button>
        </div>
      </div>
    </main>
  );
};

export default TakeQuiz;
