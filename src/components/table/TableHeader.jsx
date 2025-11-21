import { memo, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const TableHeader = ({
  selectable,
  setSelectedItems,
  selectedItems,
  column,
  setSort,
  data,
}) => {
  const updateSortStatus = useCallback(
    (column, e) => {
      setSort((prev) => {
        const prevStatus = prev[column.name]?.startsWith("-");
        e.target.parentElement.className = prevStatus ? "a-z" : "z-a";
        return {
          [column.name]: `${prevStatus ? "" : "-"}${column.name}`,
        };
      });
    },
    [setSort]
  );

  const isAllSelected =
    selectedItems?.size === data?.length && data?.length !== 0;

  const { userDetails } = useAuth();
  const role = userDetails?.role;

  const header = useMemo(
    () =>
      column?.map(
        (th) =>
          !th.hidden &&
          (!th.allowedTo || th?.allowedTo?.includes(role)) && (
            <th key={th.headerName}>
              {typeof th.headerName === "function"
                ? th.headerName()
                : th.headerName}
              {th.sort && (
                <i
                  className="fa-solid fa-chevron-right sort"
                  onClick={(e) => {
                    updateSortStatus(th, e);
                  }}
                ></i>
              )}
            </th>
          )
      ),
    [column, updateSortStatus, role]
  );

  const location = useLocation();

  const selectAll = useCallback(() => {
    if (!data) return;

    setSelectedItems((prev) => {
      let allIds = [];
      if (
        location.pathname.includes("user") ||
        location.pathname.includes("admin")
      )
        allIds = data
          .filter((item) => item.id !== userDetails?.id)
          .map((item) => item.id);
      else allIds = data.map((item) => item.id);

      if (prev.size === allIds.length) {
        return new Set();
      }

      return new Set(allIds);
    });
  }, [data, userDetails, setSelectedItems, location.pathname]);

  return (
    <thead>
      <tr>
        {selectable && (
          <th>
            <div
              className={`${isAllSelected ? "active" : ""} checkbox select-all`}
              onClick={selectAll}
            />
          </th>
        )}
        {header}
      </tr>
    </thead>
  );
};

export default memo(TableHeader);
