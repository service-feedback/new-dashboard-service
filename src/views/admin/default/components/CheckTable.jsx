import React, {  } from "react";
import CardMenu from "components/card/CardMenu";
// import Checkbox from "components/checkbox";
import Card from "components/card";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

const CheckTable = (props) => {
  // const { columnsData, tableData } = props;
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  // const columns = useMemo(() => columnsData, [columnsData]);
  // const data = useMemo(() => tableData, [tableData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = "your_token_here"; // You need to set your token here
        const res = await axios.get(
          "https://feedback-nine-jade.vercel.app/getUserData",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const columnsData = [
          {
            Header: "S.No",
            accessor: (row, rowIndex) => rowIndex + 1,
            disableSortBy: true,
          },
          { Header: "Name", accessor: "name" },
          { Header: "Phone Number", accessor: "phone" },
          { Header: "Service Location", accessor: "location" },
          { Header: "Vehicle Number", accessor: "vehicleNumber" },
          { Header: "Url", accessor: "url" },
          { Header: "Date", accessor: "date" },
          { Header: "Time", accessor: "time" },
        ];
        setColumns(columnsData);
        setData(res.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 11;

  return (
    <Card extra={"w-full h-82 sm:overflow-auto px-6"}>
      {" "}
      {/* Adjusted height to 80 (you can set it to any desired fixed height) */}
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Recent Data
        </div>

        <CardMenu />
      </header>
      <div className="h-80 mt-8 overflow-y-auto">
        {" "}
        {/* Changed to overflow-y-auto to handle vertical scrolling */}
        <table
          {...getTableProps()}
          className="w-full"
          variant="simple"
          color="gray-500"
          mb="24px"
        >
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border-b border-gray-200 pr-16 pb-[10px] text-start dark:!border-navy-700"
                    key={index}
                  >
                    <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={rowIndex}>
                  {row.cells.map((cell, cellIndex) => {
                    let data = cell.value;
                    if (cell.column.Header === "Url") {
                      data = (
                        <a
                          href={cell.value}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {cell.value}
                        </a>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cellIndex}
                        className="pt-[14px] pb-3 text-[15px]"
                      >
                        {data}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CheckTable;
