function DataTable({ columns, data, loading, emptyMessage }) {
  if (loading) {
    return <div style={{ padding: "var(--spacing-xl)", textAlign: "center", color: "var(--text-muted)" }}>Loading data...</div>;
  }

  if (!data || data.length === 0) {
    return <div style={{ padding: "var(--spacing-xl)", textAlign: "center", color: "var(--text-muted)" }}>{emptyMessage || "No data available."}</div>;
  }

  return (
    <div className="table-container">
      <table className="modern-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

