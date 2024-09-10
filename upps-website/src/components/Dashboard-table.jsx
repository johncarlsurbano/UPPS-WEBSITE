import "../styles/DashboardTable.css";
import { DashboardTableData } from "./DashboardTableData";

export const DashboardTable = () => {
  return (
    <div className="dashboard-table">
      <table>
        <tr className="dashboard-table-header">
          <th>Name</th>
          <th>Date</th>
          <th>Time-in</th>
          <th>Type</th>
          <th>Request</th>
          <th>Status</th>
          <th>Detail</th>
        </tr>
        <DashboardTableData
          name="Brix Daomilas"
          date="9/10/24"
          time="1:00pm"
          type="Printing"
          request="Examination"
          status="In-progress"
        />
        <DashboardTableData
          name="John Carl"
          date="9/10/24"
          time="1:00pm"
          type="Printing"
          request="Examination"
          status="In-progress"
        />
        <DashboardTableData
          name="Eimann Joshua Calderon"
          date="9/10/24"
          time="1:00pm"
          type="Printing"
          request="Examination"
          status="In-progress"
        />
      </table>
    </div>
  );
};
