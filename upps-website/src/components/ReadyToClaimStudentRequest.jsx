import "../styles/DashboardTable.css";
import { ReadyToClaimStudentRequestData } from "./ReadyToClaimStudentRequestData";

export const ReadyToClaimRequestStudent = ()=>{
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
            <ReadyToClaimStudentRequestData
              name="Brix Daomilas"
              date="9/10/24"
              time="1:00pm"
              type="Printing"
              request="Examination"
              status="Ready To Claim"
            />
            <ReadyToClaimStudentRequestData
              name="John Carl"
              date="9/10/24"
              time="1:00pm"
              type="Printing"
              request="Examination"
              status="Ready To Claim"
            />
            <ReadyToClaimStudentRequestData
              name="Eimann Joshua Calderon"
              date="9/10/24"
              time="1:00pm"
              type="Printing"
              request="Examination"
              status="Ready To Claim"
            />
          </table>
        </div>
      );
}