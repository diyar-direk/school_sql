import { memo, useCallback, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

  const rows = useMemo(
    () =>
      data?.map((row) => {
        const hideCheckbox =
          (location.pathname.includes("user") ||
            location.pathname.includes("admin")) &&
          row.id === userDetails?.id;

        return (
          <tr key={row.id}>
            {selectable && (
              <td>
                {!hideCheckbox && (
                  <div
                    onClick={() => selectRowId(row.id)}
                    className={`checkbox ${
                      selectedItems?.has(row.id) ? "active" : ""
                    }`}
                  ></div>
                )}
              </td>
            )}

            {column?.map(
              (column) =>
                !column.hidden &&
                (!column.allowedTo ||
                  column.allowedTo?.includes(userDetails?.role)) && (
                  <td key={column.name} className={column?.className || ""}>
                    {renderCell(column, row)}
                  </td>
                )
            )}
          </tr>
        );
      }),
    [
      data,
      column,
      renderCell,
      selectable,
      selectedItems,
      selectRowId,
      userDetails,
      location.pathname,
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
            no results found
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default memo(TableBody);
