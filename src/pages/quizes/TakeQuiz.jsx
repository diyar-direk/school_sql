import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
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
  const [time, setTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");
  const [answers, setAnswers] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setAnswers(res.data.data.questions);
        setTime(new Date(res.data.data.endDate));
      });
  }, []);

  useEffect(() => {
    if (!time) return;

    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const ms = time - currentTime;

      if (ms <= 0) {
        clearInterval(intervalId);
        setRemainingTime("00:00:00");
        return;
      }

      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);

      setRemainingTime(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);

  const questions = data?.questions?.map((e, i) => {
    return (
      <>
        <h3 key={i - 10}> {`Q-${i + 1}`} </h3>
        {e.type === "true-false" && (
          <div key={i + 10} className="center wrap justify-start gap-10">
            <h2 className="flex-1 true-false"> {e.text} </h2>
            <div className="flex gap-10">
              <i
                onClick={(icon) => {
                  icon.target.classList.add("active");
                  icon.target.nextElementSibling.classList.remove("active");
                  const fltr = answers.filter((ele) => ele !== e);
                  setAnswers([...fltr, { ...e, studentAnswer: "true" }]);
                }}
                className="fa-solid fa-check true"
              ></i>
              <i
                onClick={(icon) => {
                  icon.target.classList.add("active");
                  icon.target.previousElementSibling.classList.remove("active");
                  const fltr = answers.filter((ele) => ele !== e);
                  setAnswers([...fltr, { ...e, studentAnswer: "false" }]);
                }}
                className="fa-solid fa-xmark false"
              ></i>
            </div>
          </div>
        )}
        {e.type === "multiple-choice" && (
          <div key={i + 10} className="center wrap justify-start gap-10">
            <h2 className="flex-1">{e.text}</h2>
            <article className={`w-100 multi ans-${i}`}>
              {e.choices?.map((ele, index) => (
                <div
                  onClick={(div) => {
                    const allDivs = document.querySelectorAll(
                      `.multi.ans-${i} > div`
                    );
                    allDivs.forEach((e) => e.classList.remove("active"));
                    div.target.classList.add("active");
                    const fltr = answers.filter(
                      (q) => q !== e && q.quastionId !== e._id
                    );
                    setAnswers([
                      ...fltr,
                      { ...ele, studentAnswer: true, quastionId: e._id },
                    ]);
                  }}
                  className="center gap-10"
                >
                  <div className="radio"></div>
                  <h4 className="flex-1"> {`${index + 1}: ${ele.text}`} </h4>
                </div>
              ))}
            </article>
          </div>
        )}
      </>
    );
  });

  const submitQuiz = async (e) => {
    e.preventDefault();
    let ans = 0;
    answers.forEach((e) => {
      if (e.studentAnswer)
        if (
          e.studentAnswer === e.correctAnswer ||
          e.studentAnswer === e.isCorrect
        )
          ans++;
    });
    const score = parseFloat(((ans * 100) / answers.length).toFixed(2));
  };

  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <div className="center between quiz-title">
            <h1 className="title">{data.subjectId?.name}</h1>
            <div>
              <h2 className="text-capitalize">{name}</h2>
              <h3 className="text-capitalize">{data.duration} minuets </h3>
            </div>
          </div>
          <h2 className="time gap-10 center text-capitalize">
            remaining time : <span> {remainingTime} </span>
          </h2>

          <div className="questions-space">{questions}</div>

          <button onClick={submitQuiz} className="btn">
            finish the quiz
          </button>
        </div>
      </div>
    </main>
  );
};

export default TakeQuiz;
