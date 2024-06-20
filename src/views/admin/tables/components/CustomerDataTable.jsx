import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import React, { useState, useEffect } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import axios from "axios";
import * as XLSX from "xlsx";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { FaFileDownload } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner"; // Import the loader spinner

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
        value={globalFilter || ""}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "",
        }}
        className="mx-2 my-7 rounded border border-gray-300 px-2 py-1 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
      />
    </span>
  );
};

const CustomerData = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("https://feedback-git-main-feedback-services-projects.vercel.app/getUserData", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const columnsData = [
          { Header: "S.No", accessor: (row, rowIndex) => rowIndex + 1, disableSortBy: true },
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
      } finally {
        setLoading(false); // Stop loading after data is fetched or error occurs
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
    state: { pageIndex, pageSize, globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    setPageSize
  } = tableInstance;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const fileNameParts = selectedFile.name.split(".");
    const fileExtension = fileNameParts[fileNameParts.length - 1];
    if (!(fileExtension === "xlsx" || fileExtension === "csv")) {
      alert("Please select a valid file with .xlsx or .csv extension.");
      return;
    }

    setLoading(true);

    const chunkSize = 1024 * 1024;
    let start = 0;

    while (start < selectedFile.size) {
      const end = Math.min(start + chunkSize, selectedFile.size);
      const chunk = selectedFile.slice(start, end);
      const formData = new FormData();

      const newFileName = `chunk_${selectedFile.name}`;
      formData.append("file", chunk, newFileName);

      try {
        await axios.post(
          "https://feedback-git-main-feedback-services-projects.vercel.app/importUser",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        start += chunkSize;
      } catch (error) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Please upload a filename contains text service in it.") {
          setUploadError(errorMessage);
        } else if (error.response.data.data?.duplicateEntries) {
          const duplicateEntries = error.response.data.data.duplicateEntries;
          setUploadError(
            `Duplicate entries found at rows: ${duplicateEntries
              .map((entry) => entry.row)
              .join(", ")}`
          );
        } else {
          setUploadError("An error occurred while uploading the file.");
        }
        break;
      }
    }

    setLoading(false);

    if (start >= selectedFile.size) {
      setUploadError("");
      setSelectedFile(null);
      window.location.reload();
    }
  };

  const headers = [
    "id",
    "name",
    "phone",
    "location",
    "vehicleNumber",
    "url",
    "date",
    "time",
  ];

  const dataRows = data.map((row) => {
    const { _id, isDeleted, createdAt, updatedAt, __v, leadFrom, ...filteredRow } = row;
    return headers.map((header) =>
      filteredRow.hasOwnProperty(header) ? filteredRow[header] : ""
    );
  });

  const handleDownloadXLSX = () => {
    const wb = XLSX.utils.book_new();
    // const wb = XLSX.utils.book_new();
  const wsData = [headers, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Generate XLSX file as a binary string
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  // Convert binary string to ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  };

  // Create a Blob from the ArrayBuffer
  const blob = new Blob([s2ab(wbout)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  // Create download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  a.download = `Customer Data-${formattedDate}.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  };

  // function s2ab(s) {
  //   const buf = new ArrayBuffer(s.length);
  //   const view = new Uint8Array(buf);
  //   for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  //   return buf;
  // }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setUploadError("");
  };

  return (
    <Card extra={"w-full h-full p-4"}>
      <div className="relative flex items-center justify-between">
        <CardMenu />
      </div>

      {/* File upload and download */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <button className="flex items-center text-[#4319ff] dark:text-[#fbdb5c] dark:bg-gray-900 dark:border-gray-700" onClick={handleOpen}>
            <CloudUpload />
          </button>
        </div>
        <div className="absolute top-12 left-2 mr-2 mt-3 mb-4">
          <h2> Upload</h2>
        </div>
        <div className="absolute top-7 right-4">
          <div>
            <button
              onClick={handleDownloadXLSX}
              className="flex items-center text-[#4319ff] dark:text-[#fbdb5c] dark:bg-gray-900 dark:border-gray-700"
            >
              <FaFileDownload
                style={{
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
      </div>

      {/* Global Search */}
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
        <div className="h-full overflow-x-scroll xl:overflow-x-hidden">
          <table
            {...getTableProps()}
            className="mt-8 h-max w-full"
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
                      className="border-b border-gray-200 pr-8 pb-[10px] text-start dark:!border-navy-700 "
                      key={index}
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
              {page.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={rowIndex}>
                    {row.cells.map((cell, cellIndex) => {
                      let data = cell.value;
                      if (cell.column.Header === "Url") {
                        data = (
                          <a href={cell.value} target="_blank" rel="noopener noreferrer">
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
      )}

      {/* Pagination */}
      {/* <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"} Previous
          </button>
          <span className="mx-2">|</span>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Next {">"}
          </button>
        </div>
        <div>
          Page{" "}
          <strong>
            {pageIndex + 1} of {Math.ceil(data.length / pageSize)}
          </strong>{" "}
        </div>
      </div> */}
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <TextField
            type="file"
            onChange={handleFileChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          {uploadError && (
            <div className="mt-4 text-red-500">
              {uploadError}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUploadFile} color="primary" disabled={loading}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CustomerData;
