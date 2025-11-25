import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./quiz.css";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";
import ConfirmPopUp from "../../components/popup/ConfirmPopUp";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endPoints } from "../../constants/endPoints";
import { useFormik } from "formik";
import {
  courseStatus,
  examTypes,
  questionTypes,
  tofQuestionStatus,
} from "../../constants/enums";
import Button from "../../components/buttons/Button";
import { pagesRoute } from "../../constants/pagesRoute";
import Skeleton from "../../components/skeleton/Skeleton";
import { useTranslation } from "react-i18next";
const TakeQuiz = () => {
  const { id } = useParams();
  const { userDetails } = useAuth();
  const { profileId } = userDetails || {};
  const [time, setTime] = useState(0);

  const nav = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [endPoints.quizzes, id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${endPoints.quizzes}/${id}`);
      const { data: res } = data;
      setTime(new Date(new Date(res?.date).getTime() + res?.duration * 60000));
      return data.data;
    },
  });

  const { data: result, isLoading: checkingLoading } = useQuery({
    queryKey: [
      endPoints["student-courses"],
      profileId?.id,
      id,
      endPoints["exam-results"],
    ],

    queryFn: async () => {
      const { data: courseRes } = await axiosInstance.get(
        endPoints["student-courses"],
        {
          params: {
            studentId: profileId?.id,
            status: courseStatus.Active,
            limit: 1,
            page: 1,
            courseId: data?.courseId?.id,
          },
        }
      );

      const hasCourse = courseRes?.total > 0;

      const { data: gradeRes } = await axiosInstance.get(
        endPoints["exam-results"],
        {
          params: {
            studentId: profileId?.id,
            quizId: id,
            type: examTypes.Quiz,
            limit: 1,
            page: 1,
          },
        }
      );

      const hasGrade = gradeRes?.total > 0;
      const grade = hasGrade ? gradeRes?.data?.[0]?.score : null;

      return {
        canTake: hasCourse && !hasGrade,
        grade,
      };
    },

    enabled: Boolean(data),
  });

  const name = `${profileId?.firstName} ${profileId?.middleName} ${profileId?.lastName}`;
  const [remainingTime, setRemainingTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!time) return;

    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const ms = time - currentTime;

      if (ms <= 0) {
        clearInterval(intervalId);
        setRemainingTime("00:00:00");
        formik.handleSubmit();
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

  const query = useQueryClient();

  const submitQuiz = useMutation({
    mutationFn: async (values) => {
      await axiosInstance.post(endPoints.submitQuize, values);
    },
    onSuccess: () => {
      nav(pagesRoute?.examResult?.page, {
        state: { quizId: id, courseId: data?.courseId?.id },
      });
      query.invalidateQueries([endPoints.quizzes, endPoints["exam-results"]]);
    },
    onError: () => {
      setIsOpen(false);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      studentAnswers:
        data?.Questions?.map((q) => ({
          questionId: q.id,
          answer: "",
        })) || [],
      quizId: id,
    },
    onSubmit: (v) => result?.canTake && submitQuiz.mutate(v),
  });

  if (checkingLoading || isLoading)
    return (
      <div className="container">
        <Skeleton height="200px" />
      </div>
    );

  if (result?.grade >= 0) {
    return (
      <p className="center text-capitalize font-color">
        {t("take_quiz.you_allready_took_and_scored")} {result.grade}
      </p>
    );
  }

  if (!result?.canTake && !checkingLoading) {
    return (
      <p className="center text-capitalize font-color">
        {t("take_quiz.cant_take_this_quiz")}
      </p>
    );
  }

  return (
    <>
      <div className="container relative">
        <ConfirmPopUp
          isOpen={isOpen}
          heading={t("take_quiz.confirm_sending")}
          onConfirm={formik.handleSubmit}
          confirmText={t("take_quiz.submit")}
          cancelText={t("take_quiz.cancel")}
          onClose={() => setIsOpen(false)}
        />

        <>
          <div className="center between quiz-title">
            <h1 className="title">{data?.Course?.name}</h1>
            <div>
              <h2 className="text-capitalize">{name}</h2>
              <h3 className="text-capitalize">
                {data?.duration}
                {t("take_quiz.minutes")}
              </h3>
            </div>
          </div>
          <h2 className="time gap-10 center text-capitalize">
            {t("take_quiz.remainig_time")}
            <span> {remainingTime} </span>
          </h2>

          {data?.Questions?.map((q, i) => (
            <div key={q.id} className="questions-space">
              <h3>{`Q-${i + 1}`}</h3>

              {q.type === questionTypes.TOF && (
                <div className="center wrap justify-start gap-10">
                  <h2 className="flex-1 true-false">{q.text}</h2>
                  <div className="flex gap-10">
                    {Object.values(tofQuestionStatus)?.map((option) => {
                      const isActive =
                        formik.values.studentAnswers[i]?.answer === option;
                      return (
                        <label key={option}>
                          <input
                            type="radio"
                            name={`studentAnswers[${i}].answer`}
                            value={option}
                            checked={isActive}
                            onChange={formik.handleChange}
                            hidden
                          />
                          {option === tofQuestionStatus.true && (
                            <i
                              className={`fa-solid fa-check true ${
                                isActive ? "active" : ""
                              }`}
                            />
                          )}
                          {option === tofQuestionStatus.false && (
                            <i
                              className={`fa-solid fa-xmark false ${
                                isActive ? "active" : ""
                              }`}
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {q.type === questionTypes.MC && (
                <div className="center wrap justify-start gap-10">
                  <h2 className="flex-1">{q.text}</h2>
                  <article className="w-100 multi">
                    {q?.Choices?.map((choice, index) => {
                      const isActive =
                        formik.values.studentAnswers[i]?.answer === choice.text;

                      return (
                        <label key={choice.id || index} className="flex-1">
                          <input
                            type="radio"
                            name={`studentAnswers[${i}].answer`}
                            value={choice.text}
                            checked={isActive}
                            onChange={formik.handleChange}
                            hidden
                          />
                          <div className={`flex-1 ${isActive ? "active" : ""}`}>
                            <h4 className="flex-1">{choice.text}</h4>
                          </div>
                        </label>
                      );
                    })}
                  </article>
                </div>
              )}
            </div>
          ))}

          <Button onClick={() => setIsOpen(true)}>
            {t("take_quiz.finish_this_quiz")}
          </Button>
        </>
      </div>
    </>
  );
};

export default TakeQuiz;
