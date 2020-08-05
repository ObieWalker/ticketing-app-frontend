import React from "react"
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner'
import RequestModal from './RequestModal'
import { getRequestsSuccess, setRequestToChange } from '../../lib/actions/requestActions';
import { getCommentsSuccess } from '../../lib/actions/commentActions';
import utilStyles from '../../styles/utils.module.css';
import requestsStyles from '../../styles/requests.module.css'
import { formatDate, titleize } from '../../utils/formatUtil';
import { getCookie } from '../../utils/cookieUtil';
import useDebounce from '../../lib/hooks/use-debounce';
import { statusEnum } from '../../lib/constants/enumConstant'
import RadioButtons from './RequestRadioButtons';
import NavigateButtons from '../buttons/NavigateButtons';
import MonthlyExport from '../buttons/MonthlyExportButton';
import {requestColumnHeaders} from '../tables/TableColumns';

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
  const [exportState, setExportState] = useState(false)
  
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
    const resp = await fetch(`${process.env.API_SERVER}requests?${query}`, {
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

  const getComments = async (id) => {
    const resp = await fetch(`${process.env.API_SERVER}api/comments?requestId=${id}`, {
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

  const generateMonthlyExport = async () => {
    const token = user.token ? user.token : getCookie("token")
    const resp = await fetch(`${process.env.API_SERVER}api/requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
        'export': true
      }
    })
    const json = await resp.json()
    if (json.status == 200){
      dispatch(getRequestsSuccess(json.requests))
      setExportState(true)
    }
  }

  const handleSave = async (
    requestId = changedValues.request,
    status = changedValues.status,
    agent_assigned = changedValues.agentAssigned
  ) => {
    dispatch(setRequestToChange())
    const token = user.token ? user.token : getCookie("token")
    const resp = await fetch(`${process.env.API_SERVER}api/requests?requestId=${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token
      },
      body: JSON.stringify({
        request: {
          status,
          agent_assigned
        }
      })
    })
    const json = await resp.json()
    if (json.status == 200) {
      toast.success(json.message)
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
    let currentStatusIndex = statusEnum.indexOf(currentStatus)

    return (
      <>
        {currentStatus && <option value={currentStatusIndex}>{titleize(currentStatus)}</option>}
        {statusEnum.map((status, i) => {
          if (i != currentStatusIndex) return <option key={i} value={i}>{titleize(status)}</option>
        })}
      </>
    )
  }
  
  const renderOptions = (agentAssigned) => {
    if (user.user_id == agentAssigned){
      return (
        <>
          <option value="" defaultValue hidden>Assign Option</option>
          <option value="">Unassign</option>
        </>
      )
    } else if (!agentAssigned){
      return (
        <>
          <option value="" defaultValue hidden>Assign Option</option>
          <option value={user.user_id}>Self-Assign</option>
        </>
      )
    } else {
      return (
        <>
          <option value="" defaultValue hidden>Assign Options</option>
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
      <select name="agentAssigned"
        onChange={(e) => handleSelect(e, request)}
        className={requestsStyles.statusSelect}>
        {renderOptions(agentAssigned)}
      </select>
    )
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
              className={requestsStyles.statusSelect}
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
          <td><button className={utilStyles.makeComment}
            onClick={() => handleRequestclick(request)}>View/Make Comment</button></td>
          { request.changed &&
            <td><button className={utilStyles.saveButton}
              onClick={() => handleSave(request.id)}>Save</button>
            </td>
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
      user.role == 2 &&
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

  const clearExportState = () => {
    setExportState(false)
    setQueryValues(initialQueryValues)
  }

  return (
    isSearching && !queryValues.search ?
      <span className={utilStyles.tableLoader}>
        <Loader
          type="Rings"
          color="#4699B3"
          height={200}
          width={300}
        />
      </span>
      :
      requestsExist() &&
        <div className={requestsStyles.requestsView}>
          <div>
            <h2>Requests.</h2>
            <form className={utilStyles.searchBox}>
              <input type="text" onChange={(e) => search(e)} placeholder="Search by Subject..." name="search"/>
            </form>
            {
              isSearching &&
                <Loader
                  type="ThreeDots"
                  color="#4699B3"
                  height={50}
                  width={50}
                />
            }
            <RadioButtons />
            <MonthlyExport
              role={user.role}
              generateMonthlyExport={generateMonthlyExport}
            />
            { exportState &&
              <div onClick={clearExportState}>
                <ReactHTMLTableToExcel
                  id="test-table-xls-button"
                  className="download-table-xls-button"
                  table="exportable"
                  filename="tablexls"
                  sheet="tablexls"
                  buttonText="Download export as XLS"
                />
              </div>
            }
            {allRequests.length ?
              <>
                <NavigateButtons
                  previousPage={previousPage}
                  previousButton={previousButton}
                  nextPage={nextPage}
                  nextButton={nextButton}/>
                <table id="exportable" className={requestsStyles.requestsTable}>
                  {requestColumnHeaders(user)}
                  <tbody>
                    {renderTableData()}
                  </tbody>
                </table>
              </>
              :
              <p className={utilStyles.errorMessage}>
                No requests.
              </p>
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
