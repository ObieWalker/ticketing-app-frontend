import utilStyles from '../../styles/utils.module.css'
import requestsStyles from '../../styles/requests.module.css';


export default function MonthlyExport ({role, generateMonthlyExport}) {
  return (
    role != 2 &&
      <button
        onClick={generateMonthlyExport}
        title="Last 30 days"
        className={requestsStyles.toolTip}>
          Generate Closed Requests
      </button>
  )
}