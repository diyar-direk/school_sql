import { useContext } from "react";
import "../../components/form.css";
import { Context } from "../../context/Context";
import { FieldArray, Formik } from "formik";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { quizeSchema } from "../../schemas/quizeSchema";
import Input from "../../components/inputs/Input";
import dateFormatter from "../../utils/dateFormatter";
import Button from "../../components/buttons/Button";
import { questionTypes } from "../../constants/enums";
import IconButton from "./../../components/buttons/IconButton";
import { questionTypeOptions, tofOptions } from "./questionTypeOptions";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { endPoints } from "../../constants/endPoints";
import APIClient from "./../../utils/ApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
const AddQuiz = () => {
  const context = useContext(Context);

  const language = context && context.selectedLang;
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
        <h1 className="title">{language?.quizzes?.add_a_quiz}</h1>

        <Formik
          initialValues={{
            title: "",
            courseId: "",
            classId: "",
            description: "",
            date: dateFormatter(new Date()),
            endDate: "",
            questions: [],
          }}
          validationSchema={quizeSchema}
          onSubmit={(values) =>
            handleSubmit.mutate({
              ...values,
              courseId: values?.courseId?._id,
              classId: values?.classId?._id || null,
            })
          }
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit} className="dashboard-form">
              <h1>{language?.exams?.please_complete_form}</h1>

              <div className="flex wrap">
                <Input
                  errorText={formik.errors?.title}
                  title={language?.quizzes?.exam_title}
                  placeholder={language?.quizzes?.exam_title_placeholder}
                  name="title"
                  onChange={formik.handleChange}
                  value={formik?.values?.title}
                />

                <SelectInputApi
                  label="course"
                  optionLabel={(e) => e?.name}
                  placeholder={formik.values?.courseId?.name || "select course"}
                  endPoint={endPoints.courses}
                  onChange={(e) => formik.setFieldValue("courseId", e)}
                  errorText={formik.errors?.courseId}
                />
                <SelectInputApi
                  label="class"
                  optionLabel={(e) => e?.name}
                  placeholder={formik.values?.classId?.name || "select class"}
                  endPoint={endPoints.classes}
                  onChange={(e) => formik.setFieldValue("classId", e)}
                  errorText={formik.errors?.classId}
                />

                <Input
                  errorText={formik.errors?.date}
                  title={language?.quizzes?.quiz_date}
                  name="date"
                  onChange={formik.handleChange}
                  value={formik?.values?.date}
                  type="datetime-local"
                />

                <Input
                  errorText={formik.errors?.endDate}
                  title={"language?.quizzes?.endDate"}
                  name="endDate"
                  onChange={formik.handleChange}
                  value={formik?.values?.endDate}
                  type="datetime-local"
                />

                <Input
                  errorText={formik.errors?.description}
                  title={language?.quizzes?.exam_discreption}
                  placeholder={language?.quizzes?.exam_discreption_placeholder}
                  name="description"
                  onChange={formik.handleChange}
                  value={formik?.values?.description}
                  elementType="textarea"
                  rows={5}
                />
              </div>

              <FieldArray name="questions">
                {({ push, remove }) => (
                  <div className="questions-section">
                    <h1>Questions</h1>

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
                        <div key={index}>
                          <Input
                            errorText={questionError?.text}
                            title={`Question ${index + 1}`}
                            placeholder="Enter question text"
                            name={`questions[${index}].text`}
                            onChange={formik.handleChange}
                            value={q.text}
                            elementType="textarea"
                            rows={4}
                          />

                          <SelectOptionInput
                            placeholder={q.type || "Select type"}
                            label="select type"
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
                                  ?.correctAnswer || "Select correct answer"
                              }
                              wrapperProps={{
                                className:
                                  formik.values?.questions[index]
                                    ?.correctAnswer,
                              }}
                              label="correct answer"
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
                                            label="Correct answer"
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
                  </div>
                )}
              </FieldArray>

              <Button type="submit">submit</Button>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddQuiz;

export function nextJoin(array, obj) {
  let text = "";
  for (let i = 0; i < array.length; i++) {
    if (array[i + 1]) text += array[i][obj] + " , ";
    else text += array[i][obj];
  }

  return text;
}
