import "./student.css";
import { courseStatus, roles } from "../../constants/enums";
import { useCallback, useEffect, useState } from "react";
import ConfirmPopUp from "../../components/popup/ConfirmPopUp";
import APIClient from "../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AllowedTo from "../../components/AllowedTo";
const StudentCourse = ({ data, studentId, setUpdatedCourse }) => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const toggleOpenOptions = useCallback((e) => {
    e.stopPropagation();
    setIsOptionOpen((s) => !s);
  }, []);

  const apiClient = new APIClient(
    `${endPoints["student-courses"]}/${endPoints["delete-many"]}`
  );

  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    const handleClick = () => isOptionOpen && setIsOptionOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isOptionOpen]);
  const queryClient = useQueryClient();

  const handleConfirm = useMutation({
    mutationFn: (data) => apiClient.deleteAll([data]),
    onSuccess: () => {
      setSelectedItem(null);
      setIsOptionOpen(false);
      queryClient.invalidateQueries([endPoints["student-courses"], studentId]);
    },
  });

  return (
    <>
      <div className={`student-course ${data?.status}`}>
        <AllowedTo roles={[roles.admin]}>
          <div className="options">
            <i
              className="fa-solid fa-ellipsis-vertical"
              onClick={toggleOpenOptions}
            />
            {isOptionOpen && (
              <div>
                <span
                  className="delete"
                  onClick={() => setSelectedItem(data?._id)}
                >
                  <i className="fa-solid fa-trash" />
                  delete
                </span>
                <span className="update" onClick={() => setUpdatedCourse(data)}>
                  <i className="fa-solid fa-pen-to-square" /> update
                </span>
              </div>
            )}
          </div>
        </AllowedTo>
        <div>
          <h3>name</h3>
          <span> {data?.courseId?.name} </span>
        </div>
        <div>
          <h3>status</h3>
          {data?.status === courseStatus.Dropped ? (
            <span>
              <i className="fa-solid fa-circle-xmark" /> {data?.status}
            </span>
          ) : data?.status === courseStatus.Active ? (
            <span>
              <i className="fa-solid fa-hourglass-half" /> {data?.status}
            </span>
          ) : (
            <span>
              <i className="fa-solid fa-circle-check" /> {data?.status}
            </span>
          )}
        </div>
      </div>
      <AllowedTo roles={[roles.admin]}>
        <ConfirmPopUp
          isOpen={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={() => handleConfirm.mutate(selectedItem)}
          confirmButtonProps={{
            isSending: handleConfirm.isPending,
            isSendingText: "deleting",
          }}
        />
      </AllowedTo>
    </>
  );
};

export default StudentCourse;
