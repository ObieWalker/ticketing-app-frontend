import React from "react"
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import RequestModal from './RequestModal'
import { getRequestsSuccess, setRequestToChange } from '../../lib/actions/requestActions';
import { getCommentsSuccess } from '../../lib/actions/commentActions';
import utilStyles from '../../styles/utils.module.css';
import { formatDate, titleize } from '../../utils/formatUtil';
import { getCookie } from '../../utils/cookieUtil';
import useDebounce from '../../lib/hooks/use-debounce';


export default function ViewRequest() {

  const dispatch =  useDispatch();

  const { user } = useSelector(state => state.user)
  const { allRequests } = useSelector(state => state.request)
  const { comments } = useSelector(state => state.comment)

  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false)  
  const [currentRequest, setRequest] = useState(null)
  const [nextButton, setNextButton] = useState(true)
  const [previousButton, setPreviousButton] = useState(false)
  const [totalEntries, setTotalEntries] = useState(null)

  const initialChangeValues = {
    status: null,
    agentAssigned: null,
    request: null
  }
  const initialQueryValues = {
    search: "",
    status: "",
    page: 1
  }
  const [changedValues, setChangedValues] = useState(initialChangeValues)
  const [queryValues, setQueryValues] = useState(initialQueryValues)

  const debouncedSearchTerm = useDebounce(queryValues.search, 500);

  useEffect(() => {
    setIsSearching(true);
    getRequests()
  }, [queryValues])

  useEffect(() => {
    setButtonsState()
  }, [queryValues.page, totalEntries])

  const setButtonsState = () => {
    if (queryValues.page > 1) setPreviousButton(true)
    if (queryValues.page == Math.ceil(totalEntries/5)) setNextButton(false)
    if (queryValues.page < Math.ceil(totalEntries/5)) setNextButton(true)
    if (queryValues.page == 1) setPreviousButton(false)
  }

  const getRequests = async (
    search=queryValues.search,
    status=queryValues.status,
    page=queryValues.page
  ) => {
    let searchValue = search ? debouncedSearchTerm : ''
    const token = user.token ? user.token : getCookie("token")
    const query = `q=${searchValue}&status=${status}&page=${page}`
    const resp = await fetch(`http://localhost:3000/api/requests?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    })
    const json = await resp.json()

    setIsSearching(false);
    if (json.status == 200){
      dispatch(getRequestsSuccess(json.requests))
      setTotalEntries(json.total)
    } 
  }

  const columnHeaders = () => {
    return (
      <thead>
      <tr>
        <th>
          Subject
        </th>
        <th>
          Request
        </th>
        <th>
          Status
        </th>
        <th>
          Agent Assigned
        </th>
        <th>
          Date
        </th>
        {user.role != 2 && 
          <>
            <th>Customer Name</th>
            <th>Handle Assignment</th>
          </>
        }
      </tr>
      </thead>
    )
  }

  const getComments = async (id) => {
    const resp = await fetch(`http://localhost:3000/api/comments?requestId=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': user.token
      }
    })
    const json = await resp.json()

    if (json.status == 200) {
      dispatch(getCommentsSuccess(json.comments))
    } else {
      toast.error(json.message)
    }
  }

  const handleRequestclick = (request) => {
    getComments(request.id)
    displayModal()
    setRequest(request)
  }

  const handleStatus = (currentStatus) => {
    const statusEnum = ['unresponded', 'opened', 'closed'];
    let currentStatusIndex = statusEnum.indexOf(currentStatus)
    delete statusEnum[currentStatusIndex]
    let unselectedStatus = []
    statusEnum.map((val, i) => Boolean(val) ? unselectedStatus.push({
      "index": i ,"value": val
    }) : null )

    return (
      <>
        {currentStatus && <option value={currentStatusIndex}>{titleize(currentStatus)}</option>}
        {unselectedStatus.map((status, i) => 
          <option key={i} value={status.index}>{titleize(status?.value)}</option>
        )}
      </>
    )
  }
  
  const renderOptions = (agentAssigned) => {
    if (user.user_id == agentAssigned){
      return (
        <>
          <option value="" defaultValue disabled hidden>Assign Option</option>
          <option value="">Unassign</option>
        </>
      )
    } else if (!agentAssigned){
      return (
        <>
          <option value="" defaultValue disabled hidden>Assign Option</option>
          <option value={user.user_id}>Self-Assign</option>
        </>
      )
    } else {
      return (
        <>
          <option value="" defaultValue disabled hidden>Assign Options</option>
          <option value={user.user_id}>Self-Assign</option>
          <option value="">Unassign</option>
        </>
      )
    }
  }

  const handleSelect = (event, request) => {
    const { name } = event.target
    const { value } = event.target
    dispatch(setRequestToChange(request))
    if (request != changedValues?.request){
      const query = {
        request,
        [name]: value
      }
      setChangedValues(query)
      return
    }
    const query = {
      request,
      [name]: value
    }
    setChangedValues({...changedValues, ...query})
  }

  const handleAssignAgent = (agentAssigned, request) => {
    return (
      <select name="agentAssigned" onChange={(e) => handleSelect(e, request)} className={utilStyles.statusSelect}>
        {renderOptions(agentAssigned)}
      </select>
    )
  }

  const handleSave = () => {
  }

  const renderTableData = () => {
    return allRequests.map((request, index) => {
      const {
         request_title, request_body, status, agent_name, created_at, username, agent_assigned
      } = request.attributes || {}
      return (
        <tr key={request.id}>
          <td>{request_title}</td>
          <td>{request_body}</td>
          {
          user.role == 2 ?
            <td>{titleize(status)}</td>
            :
            <td> 
              <select name="status"
              className={utilStyles.statusSelect}
              onChange={(e) => handleSelect(e, request.id)}>
              {handleStatus(status, request.id)}
              </select>
            </td>
          }
          <td>{titleize(agent_name)}</td>
          <td>{formatDate(created_at)}</td>
          {user.role != 2 && 
            <>
              <td>{titleize(username)}</td>
              <td>{handleAssignAgent(agent_assigned, request.id)}</td>
            </>
          }
          <td><button onClick={() => handleRequestclick(request)}>View/Make Comment</button></td>
          { request.changed &&
            <td><button onClick={handleSave}>Save</button></td>
          }
        </tr>
      )
    })
  }

  const displayModal = () => {
    setShowModal(true)
  };

  const hideModal = () => {
    setShowModal(false)
    setRequest(null)
  };

  const search = (e) => {
    const { value } = e.target
    setQueryValues({...initialQueryValues, search: value})
  }

  const selectStatus = (e) => {
    const { value } = e.target
    setQueryValues({...initialQueryValues, status: value})
  }

  const requestsExist = () => {
    return !Boolean(
      allRequests.length < 1 && 
      Object.entries(queryValues).toString() ==
      Object.entries(initialQueryValues).toString()
    )
  }

  const previousPage = () => {
    setQueryValues({...queryValues, page: queryValues.page - 1})
  }
  
  const nextPage = () => {
      setQueryValues({...queryValues, page: queryValues.page + 1})
  }

  return (
    requestsExist() &&
    <div className={utilStyles.requestsView}>
      <div>
        <h3>Requests.</h3>
        <form className={utilStyles.searchBox}>
          <input type="text" onChange={(e) => search(e)} placeholder="Search by Subject..." name="search"/>
        </form>
        <div name="status" onChange={(e) => selectStatus(e)} className={utilStyles.radioButtons}>
          <input type="radio" name="status" value="" defaultChecked />
          <label htmlFor="all">All</label><br/>
          <input type="radio" name="status" value="0"/>
          <label htmlFor="unresponded">Unresponded</label><br/>
          <input type="radio" name="status" value="1"/>
          <label htmlFor="female">Opened</label><br/>
          <input type="radio" name="status" value="2"/>
          <label htmlFor="other">Closed</label>
        </div>
        <button
          title="Export Last 30 days"
          className={utilStyles.toolTip}>
            Generate Closed Requests
        </button>
        {isSearching && <div>Getting Results...</div>}
        {
          allRequests.length ?
          <>
          <div className={utilStyles.navigateButtons}>
            <button onClick={previousPage} disabled={!previousButton} className={utilStyles.round}>&#8249;</button>
            <button onClick={nextPage} disabled={!nextButton} className={utilStyles.round}>&#8250;</button>
          </div>
          <table className={utilStyles.requestsTable}>
            {columnHeaders()}
            <tbody>
              {renderTableData()}
            </tbody>
          </table>
          </>
          : <p className={utilStyles.errorMessage}>No requests.</p>
        }
      </div>
      <RequestModal
        show={showModal}
        handleClose={hideModal}
        user={user}
        comments={comments || {}}
      >
        {currentRequest}
      </RequestModal>
    </div>
  )
}