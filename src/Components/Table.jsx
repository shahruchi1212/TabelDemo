import { useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import Data from "../Helpers/Data.json";
import SortIcon from "../Assets/sort.svg";

const columns = [
  {
    label: "ID",
    key: "index",
  },
  {
    label: "Requester Name",
    key: "requesterName",
  },
  {
    label: "Subjects",
    key: "subject",
  },
];

const Table = () => {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([...Data]);

  const [tabelData, setTabelData] = useState([...data.slice(0, 2)]);
  const [sortBy, setSortBy] = useState("index");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    if (search) {
      const newData = [
        ...Data.filter(
          (value) =>
            value.index.toLowerCase().includes(search.toLowerCase()) ||
            value.requesterName.toLowerCase().includes(search.toLowerCase()) ||
            value.subject.toLowerCase().includes(search.toLowerCase())
        ).sort((a, b) =>
          sortOrder === "asc"
            ? a[sortBy].localeCompare(b[sortBy])
            : b[sortBy].localeCompare(a[sortBy])
        ),
      ];
      setTabelData([...newData.slice(0, perPage)]);
      setData(newData);
    } else {
      const newData = [
        ...Data.sort((a, b) =>
          sortOrder === "asc"
            ? a[sortBy].localeCompare(b[sortBy])
            : b[sortBy].localeCompare(a[sortBy])
        ),
      ];

      setData(newData);
      setTabelData([...newData.slice(0, perPage)]);
    }
  }, [search, sortBy, sortOrder]);

  const handlePerPageChange = (event) => {
    setPerPage(event.target.value);
    setPage(0);
    setTabelData([...data.slice(0, event.target.value)]);
  };

  const handelPreviousClick = () => {
    setPage((prev) => prev - 1);
    setTabelData([
      ...data.slice((page - 1) * perPage, perPage * (page - 1) + perPage),
    ]);
  };

  const handelNextClick = () => {
    setPage((prev) => prev + 1);
    setTabelData([
      ...data.slice((page + 1) * perPage, perPage * (page + 1) + perPage),
    ]);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleSort = (columName, order) => () => {
    setSortBy(columName);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <>
      <h2>Tickets</h2>

      <div className="table-header">
        <div className="left-table-header-container">
          <span>
            Showing {page * perPage} to{" "}
            {data.length < perPage * page + perPage
              ? data.length
              : perPage * page + perPage}{" "}
            of {data.length}
          </span>

          <div class="vertical-rule"></div>

          <label htmlFor="perpage">Per Page</label>

          <select
            id="perpage"
            value={perPage}
            onChange={handlePerPageChange}
            className="per-page-selector"
          >
            <option value={2}>2</option>
            <option value={5}>5</option>
          </select>

          <div class="vertical-rule"></div>

          <label htmlFor="columns">Columns</label>

          <Multiselect
            id="columns"
            options={columns} // Options to display in the dropdown
            selectedValues={selectedColumns} // Preselected value to persist in dropdown
            onSelect={setSelectedColumns} // Function will trigger on select event
            onRemove={setSelectedColumns} // Function will trigger on remove event
            displayValue="label" // Property name to display in the dropdown options
          />
        </div>

        <input
          value={search}
          className="search-input"
          placeholder="Search..."
          onChange={handleSearch}
        />
      </div>

      <table border={"0"} cellSpacing={"0"} cellPadding={"0"} className="table">
        <tr>
          {(selectedColumns.length ? selectedColumns : columns).map((item) => {
            return (
              <th
                align={"left"}
                key={item?.key}
                className="table-th"
                onClick={handleSort(item?.key)}
              >
                {item?.label}{" "}
                {item.key === sortBy ? (
                  sortOrder === "desc" ? (
                    <img src={SortIcon} alt="" className="icon" />
                  ) : (
                    <img src={SortIcon} alt="" className="icon-reverse" />
                  )
                ) : (
                  ""
                )}
              </th>
            );
          })}
        </tr>
        {tabelData.map((item) => {
          return (
            <tr className="table-row" key={item?.index}>
              {(selectedColumns.length ? selectedColumns : columns).map(
                (column) => {
                  return <td className="table-data">{item?.[column.key]}</td>;
                }
              )}
            </tr>
          );
        })}
      </table>

      <div className="pagination-container">
        <button onClick={handelPreviousClick} disabled={page === 0}>
          {"Previous"}
        </button>
        {page + 1}
        <button
          onClick={handelNextClick}
          disabled={data.length / perPage <= page + 1}
        >
          {"Next"}
        </button>
      </div>
    </>
  );
};

export default Table;
