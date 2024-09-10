import '../styles/DashboardTable.css';

export const DashboardTableData = ({name, date, time, type, request, status})=>{
    return(
        <tr>
            <td className='font-bold'>{name}</td>
            <td>{date}</td>
            <td>{time}</td>
            <td>{type}</td>
            <td>{request}</td>
            <td className='font-bold text-uppsyellow'>{status}</td>
            <td><a href="" id='detail-button'>Detail</a></td>
        </tr>
    );
}