import '../styles/DashboardTable.css';

export const ReadyToClaimStudentRequestData = ({name, date, time, type, request, status})=>{
    return(
        <tr>
            <td className='font-bold'>{name}</td>
            <td>{date}</td>
            <td>{time}</td>
            <td>{type}</td>
            <td>{request}</td>
            <td className='font-bold text-green-500'>{status}</td>
            <td><a href="" id='detail-button'>Detail</a></td>
        </tr>
    );
}