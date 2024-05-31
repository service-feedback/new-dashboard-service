import React, { useState, useEffect, useCallback } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import axios from "axios";
// import { Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as ExcelJS from "exceljs";
import { FaFileDownload } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner"; // Import the loader spinner

import CardMenu from "components/card/CardMenu";
import Card from "components/card";

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;

  return (
    <span>
      Search:{" "}
      <input
        className="mx-2 rounded border border-gray-300 px-2 py-1 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        value={globalFilter || ""}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </span>
  );
};

const Marketplace = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Today");
  const [loading, setLoading] = useState(true); // Loading state

  const navigate = useNavigate();

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const fetchData = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const token = localStorage.getItem("authToken");
      let res;
      if (selectedFilter === "Between" && startDate && endDate) {
        res = await axios.post(
          "https://feedback-n4uc.onrender.com/filtersfeedbacks",
          {
            filter: selectedFilter,
            startDate: startDate,
            endDate: endDate,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        res = await axios.post(
          "https://feedback-n4uc.onrender.com/filtersfeedbacks",
          {
            filter: selectedFilter,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      const columnsData = [
        {
          Header: "S.No",
          accessor: (row, rowIndex) => rowIndex + 1,
          disableSortBy: true,
          width: 50,
        },
        { Header: "FirstName", accessor: "name", width: 150 },
        { Header: "Phone Number", accessor: "phone", width: 150 },
        { Header: "Location", accessor: "location", width: 150 },
        { Header: "vehicle number", accessor: "vehicleNumber", width: 150 },
        {
          Header: "how would you rate overall performance of service center?",
          accessor: "overAllPerformance",
          width: 200,
        },
        {
          Header:
            "how would you prefer Saboo RKS which you visited rather than other service centers?",
          accessor: "preferingSabooRKS",
          width: 200,
        },
        {
          Header: "Wait time before a service advisor attended you",
          accessor: "waitTime",
          width: 200,
        },
        {
          Header: "Time & attention provided by the Service advisor",
          accessor: "advisorTimeAndAttention",
          width: 200,
        },
        {
          Header: "Service advisors understanding of work required",
          accessor: "advisorsUnderstandingWorkingRequirement",
          width: 200,
        },
        {
          Header: "Service advisors ability to listen",
          accessor: "advisorsListenAbility",
          width: 200,
        },
        {
          Header: "Behavior of Service advisor",
          accessor: "advisorsBehavior",
          width: 200,
        },
        {
          Header:
            "advisor's recommendation regarding the work required upon inspection of your car",
          accessor: "advisorsRecommendationOnWorkRequirement",
          width: 200,
        },
        {
          Header: "Explanation of work to be performed in advance",
          accessor: "advancePerformingWork",
          width: 200,
        },
        {
          Header: "Explanation about the work performed on the car",
          accessor: "workPerformedOnTheCar",
          width: 200,
        },
        {
          Header: "Quality of work performed",
          accessor: "qualityOfWork",
          width: 200,
        },
        {
          Header: "Washing & Cleanliness of the car post service",
          accessor: "postServiceWashingAndCleaning",
          width: 200,
        },
        {
          Header: "Explanation of charges in bill",
          accessor: "billExplanation",
          width: 200,
        },
        {
          Header: "Transparency in prices of services",
          accessor: "transparencyPrice",
          width: 200,
        },
        {
          Header:
            "On scale of from 0 to 10 How likely are you to recommend Saboo RKS Service",
          accessor: "recommendation",
          width: 200,
        },
        { Header: "feedback", accessor: "feedback", width: 500 },
        { Header: "Date", accessor: "date", width: 120 },
        { Header: "Time", accessor: "time", width: 120 },
      ];

      setColumns(columnsData);
      setData(res.data.data);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.message === "jwt expired"
      ) {
        navigate("/login");
      } else {
        console.error("Error fetching data:", error);
      }
    }finally {
      setLoading(false); // Stop loading after data is fetched or error occurs
    }
    
  }, [selectedFilter, startDate, endDate, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData, navigate]);

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
    state: { pageIndex, pageSize, globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
    // gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    setPageSize,
  } = tableInstance;

  const headers = [
    // "id",
    "name",
    "phone",
    "location",
    "vehicleNumber",
    "overAllPerformance",
    "preferingSabooRKS",
    "waitTime",
    "advisorTimeAndAttention",
    "advisorsUnderstandingWorkingRequirement",
    "advisorsListenAbility",
    "advisorsBehavior",
    "advisorsRecommendationOnWorkRequirement",
    "advancePerformingWork",
    "workPerformedOnTheCar",
    "qualityOfWork",
    "postServiceWashingAndCleaning",
    "billExplanation",
    "transparencyPrice",
    "recommendation",
    "feedback",
    // "leadFrom",
    "date",
    "time",

    // "isDeleted",
    // "createdAt",
    // "updatedAt",
    // "__v"
  ];

  const dataRows = data.map((row) => {
    return headers.map((header) =>
      row.hasOwnProperty(header) ? row[header] : ""
    );
  });

  const headerMapping = {
    id: "ID",
    name: "FirstName",
    phone: "Phone Number",
    location: "Location",
    vehicleNumber: "vehicle number",
    overAllPerformance:
      "how would you rate overall performance of service center?",
    preferingSabooRKS:
      "how would you prefer Saboo RKS which you visited rather than other service centers?",
    waitTime: "Wait time before a service advisor attended you",
    advisorTimeAndAttention: "Time & attention provided by the Service advisor",
    advisorsUnderstandingWorkingRequirement:
      "Service advisors understanding of work required",
    advisorsListenAbility: "Service advisors ability to listen",
    advisorsBehavior: "Behavior of Service advisor",
    advisorsRecommendationOnWorkRequirement:
      "advisor's recommendation regarding the work required upon inspection of your car",
    advancePerformingWork: "Explanation of work to be performed in advance",
    workPerformedOnTheCar: "Explanation about the work performed on the car",
    qualityOfWork: "Quality of work performed",
    postServiceWashingAndCleaning:
      "Washing & Cleanliness of the car post service",
    billExplanation: "Explanation of charges in bill",
    transparencyPrice: "Transparency in prices of services",
    recommendation:
      "On scale of from 0 to 10 How likely are you to recommend Saboo RKS Service",
    feedback: "feedback",
    date: "Date",
    time: "Time",
  };

  //   const headerMapping = {
  //     id: "ID",
  //     name: "FirstName",
  //     phone: "Phone Number",
  //     location: "Location",
  //     vehicleNumber: "vehicle number",
  //     overAllPerformance: "how would you rate overall performance of service center?",
  //     preferingSabooRKS: "how would you prefer Saboo RKS which you visited rather than other service centers?",
  //     waitTime: "Wait time before a service advisor attended you",
  //     advisorTimeAndAttention: "Time & attention provided by the Service advisor",
  //     advisorsUnderstandingWorkingRequirement: "Service advisors understanding of work required",
  //     advisorsListenAbility: "Service advisors ability to listen",
  //     advisorsBehavior: "Behavior of Service advisor",
  //     advisorsRecommendationOnWorkRequirement: "advisor's recommendation regarding the work required upon inspection of your car",
  //     advancePerformingWork: "Explanation of work to be performed in advance",
  //     workPerformedOnTheCar: "Explanation about the work performed on the car",
  //     qualityOfWork: "Quality of work performed",
  //     postServiceWashingAndCleaning: "Washing & Cleanliness of the car post service",
  //     billExplanation: "Explanation of charges in bill",
  //     transparencyPrice: "Transparency in prices of services",
  //     recommendation: "On scale of from 0 to 10 How likely are you to recommend Saboo RKS Service",
  //     feedback: "feedback",
  //     date: "Date",
  //     time: "Time",
  // };

  const handleDownloadXLSX = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Assuming headers and dataRows are defined and correctly formatted
    const wsData = [headers, ...dataRows];

    // Add headers to the worksheet
    wsData[0].forEach((header, index) => {
      // Find the corresponding value in headerMapping
      const mappedHeaderValue = headerMapping[header] || header; // Use the original header if no mapping exists
      worksheet.getCell(1, index + 1).value = mappedHeaderValue;
    });

    // Get the index of the "recommendation" column (column T)
    const recommendationColumnIndex = headers.findIndex(
      (header) => header === "recommendation"
    );

    // Add data rows to the worksheet
    wsData.slice(1).forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (colIndex < 22) {
          // Limit to column "W" (index 21)
          worksheet.getCell(rowIndex + 2, colIndex + 1).value = cell; // +2 to start from the second row
        }
      });

      // Apply color based on cell value
      row.forEach((cell, colIndex) => {
        const cellValue = cell.toString().toLowerCase();
        if (cellValue === "poor") {
          // Set cell background color to red for "Poor"
          worksheet.getCell(rowIndex + 2, colIndex + 1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF0000" }, // Red background color
            bgColor: { argb: "FFFF0000" }, // Ensure consistency
          };
          // Set font color to dark red
          worksheet.getCell(rowIndex + 2, colIndex + 1).font = {
            color: { argb: "ffffffff" }, // Dark red font color
          };
        } else if (cellValue === "average") {
          // Set cell background color to orange for "Average"
          worksheet.getCell(rowIndex + 2, colIndex + 1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFA500" }, // Orange background color
            bgColor: { argb: "FFFFA500" }, // Ensure consistency
          };
          // Set font color to dark orange
          worksheet.getCell(rowIndex + 2, colIndex + 1).font = {
            color: { argb: "ffffffff" }, // Dark orange font color
          };
        }
      });

      // Apply color to the recommendation cell based on its value
      const recommendationCellValue = row[recommendationColumnIndex];
      if (typeof recommendationCellValue === "string") {
        const numericValue = parseInt(
          recommendationCellValue.match(/\d+/)?.[0]
        );
        if (!isNaN(numericValue)) {
          let fillColor = null;
          let fontColor = null;
          if (numericValue < 7) {
            fillColor = "FFFF0000"; // Red background color
            fontColor = "ffffffff"; // Dark red font color
          } else if (numericValue === 7 || numericValue === 8) {
            fillColor = "FFFFA500"; // Orange background color
            fontColor = "ffffffff"; // Dark orange font color
          }
          if (fillColor && fontColor) {
            // Apply fill color to the recommendation cell
            worksheet.getCell(
              rowIndex + 2,
              recommendationColumnIndex + 1
            ).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: fillColor },
              bgColor: { argb: fillColor }, // Ensure consistency
            };
            // Apply font color to the recommendation cell
            worksheet.getCell(
              rowIndex + 2,
              recommendationColumnIndex + 1
            ).font = {
              color: { argb: fontColor }, // Font color
            };
          }
        }
      }
    });

    // Write workbook buffer to file
    await workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);

      // Introduce a delay to ensure modifications are fully applied
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "Service FeedBack.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Replace headers in downloaded file
        worksheet
          .getRow(1)
          .eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const originalHeader = cell.value.toString().trim().toLowerCase();
            console.log("Original Header:", originalHeader);
            for (const key in headerMapping) {
              if (key.trim().toLowerCase() === originalHeader) {
                console.log("Match found in headerMapping:", originalHeader);
                cell.value = headerMapping[key];
                console.log(cell.value);
                break; // Exit loop once a match is found
              }
            }
          });
      }, 100); // Adjust delay time as needed
    });
  };
  return (
    <Card extra={"w-full h-full sm:overflow-auto p-4"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Filters
        </div>
        <CardMenu />
      </header>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <select
            value={selectedFilter}
            onChange={handleFilterChange}
            className=" h-14 border-gray-300 px-2 py-1 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="Between">Between</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Current Month">Current Month</option>
            <option value="Last Month">Last Month</option>
            <option value="Last Week">Last Week</option>
            <option value="Last 3 Month">Last 3 Month</option>
            <option value="Last 6 Month">Last 6 Month</option>
            <option value="Last 12 Month">Last 12 Month</option>
            <option value="Previous Year">Previous Year</option>
            {/* Add more filter options here */}
          </select>
          {selectedFilter === "Between" && (
            <div className="ml-4 flex dark:text-white">
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                label="Start Date"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                className="h-14 dark:bg-gray-900 dark:text-white"
              />
              <div className="ml-4  ">
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  label="End Date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  className="h-14 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>
        <div>
          {/* <Button variant="contained" color="primary" onClick={fetchData}>
      Apply Filter
    </Button> */}
        </div>
      </div>

      <div className="absolute top-7 right-4">
        <div>
          <button
            onClick={handleDownloadXLSX}
            className="flex items-center text-[#4319ff] dark:text-[#fbdb5c] dark:bg-gray-900 dark:border-gray-700"
          >
            <FaFileDownload
              style={{
                // color: "#4319ff",
                fontSize: "24px",
                marginRight: "8px",
              }}
            />
          </button>
        </div>
      </div>
      <div className="absolute top-12 right-2 mr-2 mt-2">
        <h2> Download</h2>
      </div>

      <div className="mt-4">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <TailSpin color="#4319ff" height={80} width={80} />
        </div>
      ) : (
        <div className="h-full overflow-x-auto">
          <table
            {...getTableProps()}
            className="mt-8 w-full"
            style={{ tableLayout: "fixed" }}
            variant="simple"
            color="gray-500"
          >
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="w-80 border-b border-gray-200 pr-20 text-start dark:!border-navy-700"
                      key={index}
                      style={{ width: column.width }} // Fixed width for each column
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wide text-gray-600">
                          {column.render("Header")}
                        </span>
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={index}>
                    {row.cells.map((cell, index) => (
                      <td
                        {...cell.getCellProps()}
                        key={index}
                        className="text-black-600 p-2 text-xs text-[15px] font-medium tracking-wide"
                        style={{ width: cell.column.width }} // Apply width to each cell
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"} Previous
          </button>
          <span className="mx-2">|</span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            // className="px-3 py-1 rounded bg-gray-200 text-gray-700"
          >
            Next {">"}
          </button>
        </div>
        <div>
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageCount}
            </strong>{" "}
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="mx-2 rounded border border-gray-300 px-2 py-1 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            {[10, 20, 30, 40, 50,100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
};

export default Marketplace;
