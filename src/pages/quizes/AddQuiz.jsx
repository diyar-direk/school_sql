import "../../components/form.css";
import { FieldArray, Formik } from "formik";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import Input from "../../components/inputs/Input";
import dateFormatter from "../../utils/dateFormatter";
import Button from "../../components/buttons/Button";
import { questionTypes, roles } from "../../constants/enums";
import IconButton from "./../../components/buttons/IconButton";
import { getQuestionTypeOptions, getTofOptions } from "./questionTypeOptions";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { endPoints } from "../../constants/endPoints";
import APIClient from "./../../utils/ApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./quiz.css";
import { useTranslation } from "react-i18next";
import { getQuizeSchema } from "../../schemas/quizeSchema";
const AddQuiz = () => {
  const { userDetails } = useAuth();
  const { profileId, role } = userDetails || {};
  const { state } = useLocation();
  const courseId = state?.courseId ? JSON.parse(state?.courseId) : null;
  const { t } = useTranslation();
  const questionTypeOptions = getQuestionTypeOptions(t);
  const tofOptions = getTofOptions(t);
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const api = new APIClient(endPoints.quizzes);
  const handleSubmit = useMutation({
    mutationFn: (data) => api.addData(data),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.quizzes]);
      nav(-1);
    },
  });

  return (
    <>
      <div className="container relative">
        <h1 className="title">{t("quizzes.add_a_quiz")}</h1>

        <Formik
          initialValues={{
            title: "",
            courseId,
            description: "",
            date: dateFormatter(new Date()),
            duration: "",
            questions: [],
          }}
          validationSchema={getQuizeSchema()}
          onSubmit={(values) => {
            const start = new Date(values.date);
            const end = new Date(
              start.getTime() + Number(values.duration) * 60000
            );

            handleSubmit.mutate({
              ...values,
              courseId: values?.courseId?.id,
              endDate: end.toISOString(),
            });
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <div className="dashboard-form">
                <h1>{t("exams.please_complete_form")}</h1>
                <div className="flex wrap">
                  <Input
                    errorText={t(formik?.errors?.title)}
                    title={t("quizzes.exam_title")}
                    placeholder={t("quizzes.exam_title_placeholder")}
                    name="title"
                    onChange={formik.handleChange}
                    value={formik?.values?.title}
                  />

                  {!courseId && (
                    <SelectInputApi
                      label={t("quizzes.subject")}
                      optionLabel={(e) => e?.name}
                      placeholder={
                        formik.values?.courseId?.name ||
                        t("quizzes.subject_placeholder")
                      }
                      endPoint={endPoints.courses}
                      onChange={(e) => formik.setFieldValue("courseId", e)}
                      errorText={t(formik?.errors?.courseId)}
                      params={{
                        teacherId:
                          role === roles.teacher ? profileId?.id : null,
                      }}
                    />
                  )}

                  <Input
                    errorText={t(formik?.errors?.date)}
                    title={t("quizzes.quiz_date")}
                    name="date"
                    onChange={formik.handleChange}
                    value={formik?.values?.date}
                    type="datetime-local"
                  />

                  <Input
                    errorText={t(formik?.errors?.duration)}
                    title={t("quizzes.duration")}
                    name="duration"
                    onChange={formik.handleChange}
                    placeholder={t("quizzes.duration_palceholder")}
                    value={formik?.values?.duration}
                    type="number"
                  />

                  <Input
                    errorText={t(formik?.errors?.description)}
                    title={t("quizzes.exam_discreption")}
                    placeholder={t("quizzes.exam_discreption_placeholder")}
                    name="description"
                    onChange={formik.handleChange}
                    value={formik?.values?.description}
                    elementType="textarea"
                    rows={5}
                  />
                </div>
              </div>
              <h1 style={{ color: "var(--font-color)", marginBottom: "10px" }}>
                {t("quizzes.question")}
              </h1>

              <FieldArray name="questions">
                {({ push, remove }) => (
                  <div className="questions-section">
                    {formik.errors?.questions &&
                      typeof formik.errors?.questions === "string" && (
                        <p className="field-error">
                          {t(formik.errors?.questions)}
                        </p>
                      )}

                    {formik.values?.questions?.map((q, index) => {
                      const questionError =
                        formik.errors?.questions?.[index] || {};
                      return (
                        <div key={index} className="dashboard-form">
                          <Input
                            errorText={t(questionError?.text)}
                            title={`${t("quizzes.question")} ${index + 1}`}
                            placeholder={t(
                              "quizzes.question_title_placeholder"
                            )}
                            name={`questions[${index}].text`}
                            onChange={formik.handleChange}
                            value={q.text}
                            elementType="textarea"
                            rows={4}
                          />

                          <SelectOptionInput
                            placeholder={t(
                              q.type
                                ? `quizzes.${q.type}`
                                : "quizzes.select_question_type"
                            )}
                            label={t("quizzes.select_question_type")}
                            options={questionTypeOptions}
                            errorText={t(questionError?.type)}
                            onSelectOption={(e) =>
                              formik.setFieldValue(
                                `questions[${index}].type`,
                                e.value
                              )
                            }
                          />

                          {q.type === questionTypes.TOF && (
                            <SelectOptionInput
                              placeholder={t(
                                formik.values?.questions[index]?.correctAnswer
                                  ? `quizzes.${formik.values?.questions[index]?.correctAnswer}`
                                  : "quizzes.answer_placeholder"
                              )}
                              wrapperProps={{
                                className:
                                  formik.values?.questions[index]
                                    ?.correctAnswer,
                              }}
                              label={t("quizzes.answer")}
                              options={tofOptions}
                              errorText={t(questionError?.correctAnswer)}
                              onSelectOption={(e) =>
                                formik.setFieldValue(
                                  `questions[${index}].correctAnswer`,
                                  e.value
                                )
                              }
                            />
                          )}

                          {q.type === questionTypes.MC && (
                            <FieldArray name={`questions[${index}].choices`}>
                              {({ push: pushChoice, remove: removeChoice }) => (
                                <div className="multi-questions">
                                  {Array.isArray(q.choices) &&
                                    q.choices.map((opt, i) => {
                                      const choiceError =
                                        questionError?.choices?.[i] || {};
                                      return (
                                        <div key={i} className="relative">
                                          <Input
                                            name={`questions[${index}].choices[${i}].text`}
                                            placeholder={t(
                                              `quizzes.option_placeholder`
                                            )}
                                            title={`${t(`quizzes.option`)} ${
                                              i + 1
                                            }`}
                                            value={opt.text}
                                            onChange={formik.handleChange}
                                            errorText={t(choiceError?.text)}
                                            elementType="textarea"
                                            rows={4}
                                          />

                                          <SelectOptionInput
                                            label={t("quizzes.answer")}
                                            wrapperProps={{
                                              className: JSON.stringify(
                                                formik.values?.questions[index]
                                                  ?.choices[i]?.isCorrect
                                              ),
                                            }}
                                            placeholder={
                                              formik.values?.questions[index]
                                                ?.choices[i]?.isCorrect === true
                                                ? t("quizzes.true")
                                                : formik.values?.questions[
                                                    index
                                                  ]?.choices[i]?.isCorrect ===
                                                  false
                                                ? t("quizzes.false")
                                                : t(
                                                    "quizzes.answer_placeholder"
                                                  )
                                            }
                                            options={[
                                              {
                                                text: t("quizzes.true"),
                                                value: true,
                                              },
                                              {
                                                text: t("quizzes.false"),
                                                value: false,
                                              },
                                            ]}
                                            errorText={t(
                                              choiceError?.isCorrect
                                            )}
                                            onSelectOption={(e) => {
                                              const updatedChoices =
                                                formik.values.questions[
                                                  index
                                                ].choices.map((choice, j) => ({
                                                  ...choice,
                                                  isCorrect:
                                                    j === i ? e.value : false,
                                                }));

                                              formik.setFieldValue(
                                                `questions[${index}].choices`,
                                                updatedChoices
                                              );
                                            }}
                                          />

                                          <IconButton
                                            title="Remove option"
                                            onClick={() => removeChoice(i)}
                                            type="button"
                                            color="delete"
                                            className="remove-question"
                                          >
                                            <i className="fa-solid fa-xmark" />
                                          </IconButton>
                                        </div>
                                      );
                                    })}

                                  {typeof questionError?.choices ===
                                    "string" && (
                                    <p
                                      className="field-error"
                                      style={{ width: "100%" }}
                                    >
                                      {t(questionError?.choices)}
                                    </p>
                                  )}

                                  <Button
                                    btnStyleType="outlined"
                                    btnType="save"
                                    type="button"
                                    onClick={() =>
                                      pushChoice({
                                        text: "",
                                        isCorrect: false,
                                      })
                                    }
                                  >
                                    <i className="fa-solid fa-plus" />
                                    {t("quizzes.add_option")}
                                  </Button>
                                </div>
                              )}
                            </FieldArray>
                          )}

                          <IconButton
                            title="Remove Question"
                            onClick={() => remove(index)}
                            type="button"
                            color="delete"
                            className="remove-question"
                          >
                            <i className="fa-solid fa-trash-can" />
                          </IconButton>
                        </div>
                      );
                    })}

                    <div className="flex">
                      <Button
                        type="button"
                        btnType="main"
                        btnStyleType="outlined"
                        onClick={() =>
                          push({
                            text: "",
                            type: "",
                            choices: [],
                            correctAnswer: "",
                          })
                        }
                      >
                        <i className="fa-solid fa-plus" />
                        {t("quizzes.add_questions")}
                      </Button>
                      <Button type="submit">{t("quizzes.save")}</Button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddQuiz;
