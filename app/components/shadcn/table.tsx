import React from "react";

const TableComponent = ( data: any[]) => {
  const columns = ["Name", "School", "Program", "Ranked Relevance"];

  return (
    <table className="custom-table">
      <thead>
        <tr >
          {columns.map((column, index) => (
            <th className="text-black chivo-Roman" key={index}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, rowIndex: number) => (
          <tr key={rowIndex}>
            <td className="text-black chivo-Roman" >{row}</td>
            <td className="text-black chivo-Roman" >University of Waterloo</td>
            <td className="text-black chivo-Roman" >Computer Science</td>
            <td className="text-black chivo-Roman" >rowIndex</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
