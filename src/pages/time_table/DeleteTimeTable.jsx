import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmPopUp from "../../components/popup/ConfirmPopUp";
import APIClient from "../../utils/ApiClient";
import { useCallback } from "react";
const DeleteTimeTable = ({ isOpen, endPoint, setIsOpen }) => {
  const apiClient = new APIClient(endPoint);
  const queryClient = useQueryClient();
  const handleConfirm = useMutation({
    mutationFn: () => apiClient.deleteAll([isOpen]),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoint]);
      handleClose();
    },
  });

  const handleClose = useCallback(() => setIsOpen(null), [setIsOpen]);

  return (
    <ConfirmPopUp
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={() => handleConfirm.mutate()}
      confirmButtonProps={{ isSending: handleConfirm.isPending }}
    />
  );
};

export default DeleteTimeTable;
