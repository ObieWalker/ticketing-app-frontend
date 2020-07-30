import React from "react"
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {toast} from 'react-toastify';
import RequestModal from './RequestModal'
import { getRequestsSuccess, setRequestToChange } from '../../lib/actions/requestActions'
import { getCommentsSuccess } from '../../lib/actions/commentActions';
import utilStyles from '../../styles/utils.module.css'
import { formatDate, titleize } from '../../utils/formatUtil';


export default function ViewRequest() {

  const dispatch =  useDispatch();

  const { user } = useSelector(state => state.user)
  const {allRequests} = useSelector(state => state.request)
  const { comments } = useSelector(state => state.comment)

  const [requestError, setRequestError] = useState(null)
  const [showModal, setShowModal] = useState(false)  
  const [currentRequest, setRequest] = useState(null)
  const initialChangeValues = {
    status: null,
    agentAssigned: null,
    request: null
  }

  const [changedValues, setChangedValues] = useState(initialChangeValues)

  useEffect(() => {
   getRequests()
  }, [])
  const getRequests = async () => {
    const resp = await fetch("http://localhost:3000/api/requests?q=&status=open", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': user.token
      }
    })
    const json = await resp.json()

    if (json.status == 200) {
      dispatch(getRequestsSuccess(json.requests))
    } else {
      toast.error(json.message)
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
    console.log("event>>>")
  }

  const renderTableData = () => {
    return allRequests.map((request, index) => {
       const {
         request_title, request_body, status, agent_name, created_at, username, agent_assigned
        } = request.attributes
       return (
          <tr key={request.id}>
             <td>{request_title}</td>
             <td>{request_body}</td>
             <td><select name="status" className={utilStyles.statusSelect} onChange={(e) => handleSelect(e, request.id)}>
                {handleStatus(status, request.id)}
              </select>
            </td>
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

  return (
    <div className={utilStyles.requestsView}>
      <p className={utilStyles.errorMessage}>
        {requestError && !allRequests.length &&
          <span>Unable to get requests. {requestError}</span>
        }
      </p>
      {
        allRequests.length ?
          <div>
            <h3>Previous Requests.</h3>
            <table className={utilStyles.requestsTable}>
              {columnHeaders()}
              <tbody>
                {renderTableData()}
              </tbody>
            </table>
            
          </div>
        : <p>You have not made any requests.</p>
      }
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