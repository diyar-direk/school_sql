import { memo, useCallback, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const TableBody = ({
  loading,
  column,
  data,
  selectable,
  selectedItems,
  setSelectedItems,
}) => {
  const { userDetails } = useAuth();
  const role = userDetails?.role;

  const [isCustomPopUpOpen, setIsCustomPopUpOpen] = useState(false);

  const selectRowId = useCallback(
    (id) => {
      setSelectedItems((prev) => {
        const newIds = new Set(prev);
        if (newIds.has(id)) newIds.delete(id);
        else newIds.add(id);
        return newIds;
      });
    },
    [setSelectedItems]
  );

  const renderCell = useCallback(
    (column, row) => {
      if (column.getCell) {
        return column.getCell({
          row,
          userDetails,
          isCustomPopUpOpen,
          setIsCustomPopUpOpen,
        });
      }
      return row[column.name];
    },
    [userDetails, isCustomPopUpOpen, setIsCustomPopUpOpen]
  );

  const rows = useMemo(
    () =>
      data?.map((row) => (
        <tr key={row._id}>
          {selectable && (
            <td>
              {row?._id !== userDetails?._id && (
                <div
                  onClick={() => selectRowId(row._id)}
                  className={`checkbox ${
                    selectedItems?.has(row._id) ? "active" : ""
                  }`}
                ></div>
              )}
            </td>
          )}
          {column?.map(
            (column) =>
              !column.hidden &&
              (!column.allowedTo ||
                column.allowedTo?.includes(userDetails.role)) && (
                <td key={column.name} className={column.className}>
                  {renderCell(column, row)}
                </td>
              )
          )}
        </tr>
      )),
    [
      data,
      column,
      renderCell,
      selectable,
      selectedItems,
      selectRowId,
      userDetails,
    ]
  );

  const visibleColumnsCount = useMemo(() => {
    return (
      column?.filter(
        (col) => !col.hidden && (!col.allowedTo || col.allowedTo.includes(role))
      ).length + (selectable ? 1 : 0)
    );
  }, [column, role, selectable]);

  return (
    <tbody className={loading || rows ? "relative" : ""}>
      {loading ? (
        <tr>
          <td className="table-loading" colSpan={visibleColumnsCount}>
            loading ...
          </td>
        </tr>
      ) : rows?.length > 0 ? (
        <>{rows}</>
      ) : (
        <tr>
          <td className="no-data" colSpan={visibleColumnsCount}>
            no data found
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default memo(TableBody);
