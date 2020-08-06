import requestsStyles from '../../styles/requests.module.css'

export default function RadioButtons ({ selectStatus }) {
  return (
    <div name="status" onChange={(e) => selectStatus(e)} className={requestsStyles.radioButtons}>
      <input type="radio" name="status" value="" defaultChecked />
      <label htmlFor="all">All</label><br/>
      <input type="radio" name="status" value="0"/>
      <label htmlFor="unresponded">Unresponded</label><br/>
      <input type="radio" name="status" value="1"/>
      <label htmlFor="female">Opened</label><br/>
      <input type="radio" name="status" value="2"/>
      <label htmlFor="other">Closed</label>
    </div>
  )
}