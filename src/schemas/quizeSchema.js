import * as Yup from "yup";
import { questionTypes, tofQuestionStatus } from "../constants/enums";

export const getQuizeSchema = (isEdit = false) =>
  Yup.object().shape({
    title: Yup.string().required("error.title_required"),
    description: Yup.string().notRequired(),
    courseId: Yup.mixed()
      .required("error.please_choose_subject")
      .test("is-valid-course", "Invalid course value", (value) => {
        if (typeof value === "object" && value !== null) return !!value.id;
        if (typeof value === "number") return value > 0;
        return false;
      }),

    date: isEdit
      ? Yup.date().required("error.start_time_required")
      : Yup.date()
          .required("error.start_time_required")
          .min(new Date(), "error.date_must_be_in_the_future"),

    duration: Yup.number()
      .required("error.write_duration_in_minutes")
      .min(1, "error.can_not_be_negative_value"),

    questions: Yup.array()
      .of(
        Yup.object().shape({
          text: Yup.string().required("error.question_text_required"),
          type: Yup.string()
            .oneOf(Object.values(questionTypes))
            .required("error.question_type_required"),

          correctAnswer: Yup.string().when("type", {
            is: questionTypes.TOF,
            then: (schema) =>
              schema
                .oneOf(Object.values(tofQuestionStatus))
                .required(
                  "error.correct_answer_required_for_true_false_questions"
                ),
            otherwise: (schema) => schema.notRequired(),
          }),

          choices: Yup.array().when("type", {
            is: questionTypes.MC,
            then: (schema) =>
              schema
                .of(
                  Yup.object().shape({
                    text: Yup.string().required("error.option_text_required"),
                    isCorrect: Yup.boolean().required(),
                  })
                )
                .min(2, "error.at_least_two_options_required")
                .max(5, "error.no_more_than_five_options_allowed")
                .test(
                  "at-least-one-correct",
                  "error.at_least_one_option_must_be_marked_correct",
                  (choices) => choices?.some((c) => c.isCorrect === true)
                ),
            otherwise: (schema) => schema.notRequired(),
          }),
        })
      )
      .min(1, "error.at_least_one_question_required"),
  });
