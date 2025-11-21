import "../../components/form.css";
import { FieldArray, Formik } from "formik";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { quizeSchema } from "../../schemas/quizeSchema";
import Input from "../../components/inputs/Input";
import dateFormatter from "../../utils/dateFormatter";
import Button from "../../components/buttons/Button";
import { questionTypes, roles } from "../../constants/enums";
import IconButton from "./../../components/buttons/IconButton";
import { questionTypeOptions, tofOptions } from "./questionTypeOptions";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { endPoints } from "../../constants/endPoints";
import APIClient from "./../../utils/ApiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Skeleton from "../../components/skeleton/Skeleton";
import "./quiz.css";
import { useTranslation } from "react-i18next";
const UpdateQuiz = () => {
  const { userDetails } = useAuth();
  const { profileId, role } = userDetails || {};
  const { t } = useTranslation();

  const nav = useNavigate();
  const queryClient = useQueryClient();
  const api = new APIClient(endPoints.quizzes);

  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [endPoints.quizzes, id],
    queryFn: () => api.getOne(id),
  });

  const handleSubmit = useMutation({
    mutationFn: (data) => api.updateData({ data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.quizzes]);
      nav(-1);
    },
  });

  if (isLoading)
    return (
      <div className="container">
        <Skeleton height="200px" />
      </div>
    );

  return (
    <>
      <div className="container relative">
        <Formik
          initialValues={{
            title: data?.title || "",
            courseId: data?.courseId || "",
            description: data?.description || "",
            date: dateFormatter(data?.date),
            duration: data?.duration || "",
            questions: data?.questions || [],
          }}
          validationSchema={quizeSchema}
          enableReinitialize
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
                    errorText={formik.errors?.title}
                    title={t("quizzes.exam_title")}
                    placeholder={t("quizzes.exam_title_placeholder")}
                    name="title"
                    onChange={formik.handleChange}
                    value={formik?.values?.title}
                  />

                  <SelectInputApi
                    label="course"
                    optionLabel={(e) => e?.name}
                    placeholder={
                      formik.values?.courseId?.name || "select course"
                    }
                    endPoint={endPoints.courses}
                    onChange={(e) => formik.setFieldValue("courseId", e)}
                    errorText={formik.errors?.courseId}
                    params={{
                      teacherId: role === roles.teacher ? profileId?.id : null,
                    }}
                  />

                  <Input
                    errorText={formik.errors?.date}
                    title={t("quizzes.quiz_date")}
                    name="date"
                    onChange={formik.handleChange}
                    value={formik?.values?.date}
                    type="datetime-local"
                  />

                  <Input
                    errorText={formik.errors?.duration}
                    title={t("quizzes?.duration")}
                    name="duration"
                    onChange={formik.handleChange}
                    placeholder={t("quizzes?.duration")}
                    value={formik?.values?.duration}
                    type="number"
                  />

                  <Input
                    errorText={formik.errors?.description}
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
                {t("quizzes.questions")}
              </h1>

              <FieldArray name="questions">
                {({ push, remove }) => (
                  <div className="questions-section">
                    {formik.errors?.questions &&
                      typeof formik.errors?.questions === "string" && (
                        <p className="field-error">
                          {formik.errors?.questions}
                        </p>
                      )}

                    {formik.values?.questions?.map((q, index) => {
                      const questionError =
                        formik.errors?.questions?.[index] || {};
                      return (
                        <div key={index} className="dashboard-form">
                          <Input
                            errorText={questionError?.text}
                            title={`${t("quizzes.question")} ${index + 1}`}
                            placeholder={t("quizzes.enter_question_text")}
                            name={`questions[${index}].text`}
                            onChange={formik.handleChange}
                            value={q.text}
                            elementType="textarea"
                            rows={4}
                          />

                          <SelectOptionInput
                            placeholder={q.type || t("quizzes.select_type")}
                            label={t("quizzes.select_type")}
                            options={questionTypeOptions}
                            errorText={questionError?.type}
                            onSelectOption={(e) =>
                              formik.setFieldValue(
                                `questions[${index}].type`,
                                e.value
                              )
                            }
                          />

                          {q.type === questionTypes.TOF && (
                            <SelectOptionInput
                              placeholder={
                                formik.values?.questions[index]
                                  ?.correctAnswer ||
                                t("quizzes.select_correct_answer")
                              }
                              wrapperProps={{
                                className:
                                  formik.values?.questions[index]
                                    ?.correctAnswer,
                              }}
                              label={t("quizzes.correct_answer")}
                              options={tofOptions}
                              errorText={questionError?.correctAnswer}
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
                                            placeholder={`Option ${i + 1}`}
                                            title={`Option ${i + 1}`}
                                            value={opt.text}
                                            onChange={formik.handleChange}
                                            errorText={choiceError?.text}
                                            elementType="textarea"
                                            rows={4}
                                          />

                                          <SelectOptionInput
                                            label={t("quizzes.correct_answer")}
                                            wrapperProps={{
                                              className: JSON.stringify(
                                                formik.values?.questions[index]
                                                  ?.choices[i]?.isCorrect
                                              ),
                                            }}
                                            placeholder={
                                              formik.values?.questions[index]
                                                ?.choices[i]?.isCorrect === true
                                                ? "True"
                                                : formik.values?.questions[
                                                    index
                                                  ]?.choices[i]?.isCorrect ===
                                                  false
                                                ? "False"
                                                : "Select answer"
                                            }
                                            options={[
                                              { text: "True", value: true },
                                              { text: "False", value: false },
                                            ]}
                                            errorText={choiceError?.isCorrect}
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
                                      {questionError?.choices}
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
                                    add option
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
                        <i className="fa-solid fa-plus" /> Add Question
                      </Button>
                      <Button type="submit">submit</Button>
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

export default UpdateQuiz;
