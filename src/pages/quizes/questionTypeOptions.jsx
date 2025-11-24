import { questionTypes, tofQuestionStatus } from "../../constants/enums";

export const getQuestionTypeOptions = (t) => [
  {
    text: (
      <span className="flex align-center gap-10">
        <i className="fa-solid fa-check" style={{ color: "green" }} />
        <i className="fa-solid fa-xmark" style={{ color: "red" }} />
        {t(`quizzes.${questionTypes.TOF}`)}
      </span>
    ),
    value: questionTypes.TOF,
    props: { className: questionTypes.TOF },
  },
  {
    text: (
      <span className="flex align-center gap-10">
        <i className="fa-solid fa-list-ol" style={{ color: "blue" }} />
        {t(`quizzes.${questionTypes.MC}`)}
      </span>
    ),
    value: questionTypes.MC,
    props: { className: questionTypes.MC },
  },
];

export const getTofOptions = (t) => [
  {
    text: (
      <span className="flex align-center gap-10" style={{ color: "green" }}>
        <i className="fa-solid fa-check" />
        {t(`quizzes.${tofQuestionStatus.true}`)}
      </span>
    ),
    value: tofQuestionStatus.true,
  },
  {
    text: (
      <span className="flex align-center gap-10" style={{ color: "red" }}>
        <i className="fa-solid fa-xmark" />
        {t(`quizzes.${tofQuestionStatus.false}`)}
      </span>
    ),
    value: tofQuestionStatus.false,
  },
];
