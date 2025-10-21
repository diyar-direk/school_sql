import { useCallback, useState } from "react";
import ConfirmPopUp from "../popup/ConfirmPopUp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import IconButton from "./../buttons/IconButton";
import APIClient from "../../utils/ApiClient";

const Delete = ({
  setSelectedItems,
  queryKey,
  selectedItems,
  setPage,
  data,
  endPoint,
}) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const handleDeletePopUpClose = useCallback(() => {
    setSelectedItems(new Set());
    setIsPopUpOpen(false);
  }, [setSelectedItems]);

  const queryclient = useQueryClient();
  const apiClient = new APIClient(endPoint);
  const handleDelete = useMutation({
    mutationFn: (data) => apiClient.deleteAll(data),
    onSuccess: () => {
      if (data?.length === selectedItems?.size) {
        setPage((prev) => (prev === 1 ? prev : prev - 1));
      }
      setIsPopUpOpen(false);
      setSelectedItems(new Set());
      queryclient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
  });

  const handleConfirmDelete = useCallback(() => {
    handleDelete.mutate([...selectedItems]);
  }, [handleDelete, selectedItems]);

  return (
    <>
      <IconButton
        color="secondry-color"
        title="Delete"
        onClick={() => selectedItems?.size && setIsPopUpOpen(true)}
      >
        <i
          className={`${
            selectedItems?.size > 0 ? "color-red " : ""
          }fa-solid fa-trash`}
        />
      </IconButton>
      <ConfirmPopUp
        isOpen={isPopUpOpen}
        onClose={handleDeletePopUpClose}
        onConfirm={handleConfirmDelete}
        confirmButtonProps={{ isSending: handleDelete.isLoading }}
      />
    </>
  );
};

export default Delete;
