import { useParams } from "react-router-dom";
import { endPoints } from "../../../constants/endPoints";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { attendanceStatus } from "../../../constants/enums";
import AddAttendance from "../components/AddAttendance";
import { getAllAttendance, getStudentCourse } from "../components/api";
import { useTranslation } from "react-i18next";

const Attendance = () => {
  const { id } = useParams();
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [year, month] = selectedMonth.split("-").map(Number);
  const [days, setDays] = useState([]);

  useEffect(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  }, [year, month]);

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(
    new Date(year, month, 0).getDate()
  ).padStart(2, "0")}`;

  const { data: students } = useQuery({
    queryKey: [endPoints["student-courses"], id],
    queryFn: () => getStudentCourse({ courseId: id }),
  });

  const { data, isFetching } = useQuery({
    queryKey: [endPoints.attendances, id, startDate, endDate],
    queryFn: () =>
      getAllAttendance({
        courseId: id,
        [`date[gte]`]: startDate,
        [`date[lte]`]: endDate,
      }),
  });

  const studentsAttendance = useMemo(() => {
    const allStudents = students || [];
    const attendanceData = data || [];

    const uniqueStudents = allStudents.reduce((acc, curr) => {
      const id = curr.student.id;
      if (!acc.some((s) => s.student.id === id)) {
        acc.push(curr);
      }
      return acc;
    }, []);

    const groupedAttendance = attendanceData.reduce((acc, item) => {
      const studentId = item.student.id;
      if (!acc[studentId]) acc[studentId] = [];
      acc[studentId].push(item);
      return acc;
    }, {});

    return uniqueStudents.map((student) => {
      const fullName = `${student.student.firstName} ${student.student.lastName}`;
      return {
        name: fullName,
        studentId: student.student.id,
        data: groupedAttendance[student.student.id] || [],
      };
    });
  }, [students, data]);

  const [selectedData, setSelectedData] = useState({});

  const getStatusForDay = useCallback(
    (student, day) => {
      const { data: studentData, studentId } = student;

      const record = studentData.find((item) => {
        const date = new Date(item.date);
        return (
          date.getUTCDate() === day &&
          date.getUTCMonth() + 1 === month &&
          date.getUTCFullYear() === year
        );
      });

      if (record) {
        return (
          <div
            style={{
              background: attendanceStatusIcon[record.status].bg,
            }}
            onDoubleClick={() =>
              setSelectedData({
                student: record.studentId,
                date: record.date,
                id: record.id,
                isUpdate: true,
              })
            }
          >
            {attendanceStatusIcon[record.status].icon}
          </div>
        );
      }

      return (
        <div
          onDoubleClick={() =>
            setSelectedData({
              student: studentId,
              date: `${year}-${String(month).padStart(2, "0")}-${String(
                day
              ).padStart(2, "0")}`,
              courseId: id,
              isUpdate: false,
            })
          }
        ></div>
      );
    },
    [month, id, year]
  );

  const onClose = useCallback(() => {
    setSelectedData({});
  }, []);

  const { t } = useTranslation();

  if (isFetching)
    return <h3 className="font-color">{t("students.loading")}</h3>;

  if (studentsAttendance.length === 0)
    return <h3 className="font-color">{t("students.no_students")}</h3>;

  return (
    <>
      <div className="attendance-controls">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="attendace-table">
        <table>
          <thead>
            <tr>
              <th>{t("students.name")}</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studentsAttendance.map((student) => (
              <tr key={student.studentId}>
                <td>{student.name}</td>
                {days.map((day) => (
                  <td key={day}>{getStatusForDay(student, day)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddAttendance selectedData={selectedData} onClose={onClose} />
    </>
  );
};

export default Attendance;

export const attendanceStatusIcon = {
  [attendanceStatus.Present]: {
    icon: <i className="fa-solid fa-check" />,
    bg: "green",
  },
  [attendanceStatus.Absent]: {
    icon: <i className="fa-solid fa-xmark" />,
    bg: "#bb1b1b",
  },
  [attendanceStatus.Excused]: {
    icon: <i className="fa-solid fa-hand-point-up" />,
    bg: "orange",
  },
  [attendanceStatus.Late]: {
    icon: <i className="fa-solid fa-exclamation" />,
    bg: "gray",
  },
};
