import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../context/Context";
import "./quiz.css";
import FormLoading from "../../components/FormLoading";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";
const TakeQuiz = () => {
  const { id } = useParams();
  const context = useContext(Context);
  const [canTake, setCanTake] = useState(true);
  const { userDetails: user } = useAuth();
  const userDetails = user?.userDetails?.userDetails;
  const studentId = user?.userDetails?.userDetails?._id;
  const nav = useNavigate();
  const name = `${userDetails?.firstName} ${userDetails?.middleName} ${userDetails?.lastName}`;
  const [data, setData] = useState([]);
  const [time, setTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");
  const [answers, setAnswers] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const [takedScore, setTakedScore] = useState(0);
  const [overlay, setOverlay] = useState(false);
  const [endTime, setEndTime] = useState(false);
  const language = context && context.selectedLang;

  window.addEventListener("click", () => {
    overlay && setOverlay(false);
  });

  useEffect(() => {
    axiosInstance
      .get(`exam-results?student=${studentId}&active=true&exam=${id}&limit=1`)
      .then((res) => {
        if (res.data.data.length > 0) {
          setCanTake(false);
          setTakedScore(res.data.data[0].score);
        }
      })
      .catch((err) => {
        console.log(err);
        err.status === 400 && nav("/err-400");
      });
  }, []);

  useEffect(() => {
    if (!canTake) return;
    axiosInstance.get(`quizzes/${id}`).then((res) => {
      setData(res.data.data);
      setAnswers(res.data.data.questions);
      setTime(new Date(res.data.data.endDate));
    });
  }, [canTake]);

  useEffect(() => {
    if (!time || !canTake) return;

    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const ms = time - currentTime;

      if (ms <= 0) {
        clearInterval(intervalId);
        setRemainingTime("00:00:00");
        submitQuiz();
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
  }, [time, canTake]);

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
                  setStudentAnswers([...fltr, { ...e, studentAnswer: "true" }]);
                }}
                className="fa-solid fa-check true"
              ></i>
              <i
                onClick={(icon) => {
                  icon.target.classList.add("active");
                  icon.target.previousElementSibling.classList.remove("active");
                  const fltr = answers.filter((ele) => ele !== e);
                  setAnswers([...fltr, { ...e, studentAnswer: "false" }]);
                  setStudentAnswers([
                    ...fltr,
                    { ...e, studentAnswer: "false" },
                  ]);
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
                    setStudentAnswers([
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
    e?.preventDefault();
    setEndTime(true);
    let ans = 0;
    studentAnswers.forEach((e) => {
      if (e.studentAnswer)
        if (
          e.studentAnswer === e.correctAnswer ||
          e.studentAnswer === e.isCorrect
        )
          ans++;
    });
    const score =
      studentAnswers.length > 0
        ? parseFloat(((ans * 100) / studentAnswers.length).toFixed(2))
        : 0;
    const form = {
      exam: id,
      student: studentId,
      score,
      type: "Quiz",
    };

    try {
      await axiosInstance.post(`exam-results`, form);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <div
        className={`${context?.isClosed ? "closed" : ""}  dashboard-container`}
      >
        <div className="container relative">
          {overlay && (
            <div className="overlay">
              <div className="change-status">
                <h1>
                  {language.take_quiz && language.take_quiz.confirm_sending}
                </h1>
                <div className="flex gap-20">
                  <div onClick={submitQuiz} className="send center">
                    <h2>{language.take_quiz && language.take_quiz.submit}</h2>
                    <i className="fa-solid fa-share"></i>
                  </div>
                  <div
                    onClick={() => {
                      setOverlay(false);
                    }}
                    className="none center"
                  >
                    <h2>{language.take_quiz && language.take_quiz.cancel}</h2>
                    <i className="fa-solid fa-ban"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
          {endTime && <FormLoading />}
          {canTake ? (
            <>
              <div className="center between quiz-title">
                <h1 className="title">{data.subjectId?.name}</h1>
                <div>
                  <h2 className="text-capitalize">{name}</h2>
                  <h3 className="text-capitalize">
                    {data.duration}
                    {language.take_quiz && language.take_quiz.minutes}{" "}
                  </h3>
                </div>
              </div>
              <h2 className="time gap-10 center text-capitalize">
                {language.take_quiz && language.take_quiz.remainig_time}{" "}
                <span> {remainingTime} </span>
              </h2>

              <div className="questions-space">{questions}</div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOverlay(true);
                }}
                className="btn"
              >
                {language.take_quiz && language.take_quiz.finish_this_quiz}
              </button>
            </>
          ) : (
            <h1 className=" center text-capitalize font-color">
              {language.take_quiz &&
                language.take_quiz.you_allready_took_and_scored}{" "}
              {takedScore}
            </h1>
          )}
        </div>
      </div>
    </main>
  );
};

export default TakeQuiz;
