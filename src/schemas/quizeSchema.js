import * as Yup from "yup";
import { questionTypes, tofQuestionStatus } from "../constants/enums";

export const quizeSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().notRequired(),
  classId: Yup.object().notRequired(),
  courseId: Yup.object().required("please select a test quize"),
  date: Yup.date()
    .required("Date is required")
    .min(new Date(), "Date must be in the future"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("date"), "End date must be after start date"),

  questions: Yup.array()
    .of(
      Yup.object().shape({
        text: Yup.string().required("Question text is required"),
        type: Yup.string()
          .oneOf(Object.values(questionTypes))
          .required("Question type is required"),

        correctAnswer: Yup.string().when("type", {
          is: questionTypes.TOF,
          then: (schema) =>
            schema
              .oneOf(Object.values(tofQuestionStatus))
              .required("Correct answer is required for true/false questions"),
          otherwise: (schema) => schema.notRequired(),
        }),

        choices: Yup.array().when("type", {
          is: questionTypes.MC,
          then: (schema) =>
            schema
              .of(
                Yup.object().shape({
                  text: Yup.string().required("Option text is required"),
                  isCorrect: Yup.boolean().required(),
                })
              )
              .min(2, "At least 2 options are required")
              .max(5, "No more than 5 options allowed")
              .test(
                "at-least-one-correct",
                "At least one option must be marked correct",
                (choices) => choices?.some((c) => c.isCorrect === true)
              ),
          otherwise: (schema) => schema.notRequired(),
        }),
      })
    )
    .min(1, "At least one question is required"),
});
