import { memo, useState } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import "./table.css";
import Paginations from "./Paginations";
import CloumnsVisible from "./CloumnsVisible";

/**
 * @typedef TableProps
 * @property {Array<object>} colmuns أعمدة الجدول
 * @property {boolean} selectable هل يمكن تحديد الصفوف
 * @property {boolean} loading حالة التحميل
 * @property {number} currentPage رقم الصفحة الحالية
 * @property {(page: number) => void} setPage دالة لتغيير الصفحة
 * @property {Array<object>} data بيانات الجدول
 * @property {number} dataLength عدد البيانات الكلي (لأجل الـ Pagination)
 * @property {(sort: any) => void} setSort دالة لتحديد الفرز
 * @property {Set<string|number>} selectedItems العناصر المحددة
 * @property {(items: Set<string|number>) => void} setSelectedItems دالة لتغيير العناصر المحددة
 */
/**
 * @param {TableProps} props
 */

const Table = ({
  colmuns,
  selectable,
  loading,
  currentPage,
  setPage,
  data,
  dataLength,
  setSort,
  selectedItems,
  setSelectedItems,
}) => {
  const [columnsState, setColumnsState] = useState(colmuns || []);

  return (
    <>
      <div className="table-header">
        <CloumnsVisible
          columns={columnsState}
          setColumns={setColumnsState}
          defaultColumns={colmuns}
        />
        <div className="table">
          <table>
            <TableHeader
              selectable={selectable}
              setSelectedItems={setSelectedItems}
              column={columnsState}
              setSort={setSort}
              data={data}
              selectedItems={selectedItems}
            />
            <TableBody
              loading={loading}
              column={columnsState}
              data={data}
              selectable={selectable}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </table>
        </div>
      </div>
      <Paginations
        currentPage={currentPage}
        dataLength={dataLength}
        setPage={setPage}
        setSelectedItems={setSelectedItems}
      />
    </>
  );
};

export default memo(Table);
