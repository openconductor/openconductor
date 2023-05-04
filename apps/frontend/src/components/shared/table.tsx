import clsx from 'clsx';
import { useTable, Column } from 'react-table';

export type Props = {
  columns: Array<Column<any>>;
  data: any[];
  loading?: boolean;
  noHeader?: boolean;
  onRowClick?: (row: any) => void;
};

const Loading = ({ columns, data }: { columns: Props['columns']; data: any[] }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className="animate-pulse overflow-x-auto">
      <table className="r-table" {...getTableProps()}>
        <thead className="r-table-thead">
          {headerGroups.map((headerGroup, hdKey) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={`loading_hd${hdKey + Date.now()}`}>
              {headerGroup.headers.map((column, colKey) => (
                <th className="r-table-th" {...column.getHeaderProps()} key={`loading_col${colKey + Date.now()}`}>
                  <div className="h-2 bg-gray-600 my-2 rounded" />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="r-table-tbody" {...getTableBodyProps()}>
          {rows.map((row, rowKey) => {
            prepareRow(row);
            return (
              <tr className={clsx('r-table-tr')} {...row.getRowProps()} key={`loading_row${rowKey + Date.now()}`}>
                {row.cells.map((cell, cellKey) => {
                  return (
                    <td className="r-table-td" key={`loading_cell${cellKey + Date.now()}`}>
                      <div className="h-2 bg-gray-700 my-2 rounded" />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const Table = ({ columns, data, loading, noHeader, onRowClick }: Props) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  if (loading) {
    return <Loading columns={columns} data={data} />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="r-table" {...getTableProps()}>
        {!noHeader && (
          <thead className="r-table-thead">
            {headerGroups.map((headerGroup, hdKey) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={`table_hd${hdKey + Date.now()}`}>
                {headerGroup.headers.map((column, colKey) => (
                  <th className="r-table-th" {...column.getHeaderProps()} key={`table_col${colKey + Date.now()}`}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        )}
        <tbody className="r-table-tbody" {...getTableBodyProps()}>
          {rows.map((row, rowKey) => {
            prepareRow(row);
            return (
              <tr
                className={clsx('r-table-tr', {
                  'cursor-pointer': onRowClick,
                })}
                {...(onRowClick && { onClick: () => onRowClick(row) })}
                {...row.getRowProps()}
                key={`table_row${rowKey + Date.now()}`}
              >
                {row.cells.map((cell, cellKey) => {
                  return (
                    <td className="r-table-td" {...cell.getCellProps()} key={`table_cell${cellKey + Date.now()}`}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
