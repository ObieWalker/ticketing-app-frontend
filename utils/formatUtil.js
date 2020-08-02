import { parseISO, format } from 'date-fns'

export const userRoleName = (role) => {
  switch(role) {
    case "0": return 'Admin'
      break;
    case "1": return 'Support Agent'
      break;
    case "2": return 'Customer'
      break
    default: return 'Customer'
  }
}

export const formatDate = (dateString) => {
  return new Date(Date.parse(dateString))
  .toString()
  .replace('GMT+0100 (West Africa Standard Time)', "");
}

export const titleize = (val) => {
  if (val) return val[0].toUpperCase() + val.slice(1); 
}


export default function DateComponent({ dateString }) {
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
}