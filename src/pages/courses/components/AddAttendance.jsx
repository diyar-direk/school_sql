import PopUp from "../../../components/popup/PopUp";
import Button from "../../../components/buttons/Button";
import { attendanceStatusIcon } from "../pages/Attendance";
import { attendanceStatus } from "../../../constants/enums";
import dateFormatter from "./../../../utils/dateFormatter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAttendance, deleteAttendance, updateAttendance } from "./api";
import { endPoints } from "../../../constants/endPoints";
import { useAuth } from "../../../context/AuthContext";

const AddAttendance = ({ selectedData, onClose }) => {
  const { student, date, courseId, isUpdate, id } = selectedData;
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (status) =>
      isUpdate
        ? updateAttendance({ status, id: id })
        : addAttendance({
            studentId: student?.id || student,
            date,
            courseId,
            status,
          }),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.attendances, courseId]);
      onClose();
    },
  });
  const handleDelete = useMutation({
    mutationFn: () => deleteAttendance([id]),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.attendances, courseId]);
      onClose();
    },
  });

  const { userDetails } = useAuth();
  const { isAdmin } = userDetails || {};

  return (
    <PopUp isOpen={student} onClose={onClose} className="attendace-pop-up">
      <h1>
        {student?.firstName} {student?.lastName} attendance on
        {dateFormatter(date)}
      </h1>
      <div className="actions">
        {Object.values(attendanceStatus).map((e) => (
          <Button
            key={e}
            style={{
              background: attendanceStatusIcon[e].bg,
            }}
            onClick={() => handleSubmit.mutate(e)}
          >
            {attendanceStatusIcon[e].icon}
            {e}
          </Button>
        ))}
        {isAdmin && isUpdate && (
          <Button
            btnType="delete"
            btnStyleType="contained"
            onClick={handleDelete.mutate}
          >
            <i className="fa-solid fa-trash" /> delete status
          </Button>
        )}
      </div>
    </PopUp>
  );
};

export default AddAttendance;
