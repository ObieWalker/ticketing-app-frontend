import React from "react"
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import utilStyles from '../../styles/utils.module.css';
import { formatDate, titleize } from '../../utils/formatUtil';
import { getCookie } from '../../utils/cookieUtil';
import useDebounce from '../../lib/hooks/use-debounce';
import { getUsersSuccess, userModified } from '../../lib/actions/usersAction'
import { roles } from '../../lib/constants/enumConstant';

export default function Users() {

  const dispatch =  useDispatch();

  const { user } = useSelector(state => state.user)
  const { allUsers } = useSelector(state => state.users)

  const [isSearching, setIsSearching] = useState(false);
  const [nextButton, setNextButton] = useState(true)
  const [previousButton, setPreviousButton] = useState(false)
  const [totalEntries, setTotalEntries] = useState(null)
  const [userChanged, setUserChanged] = useState(false)


  const initialQueryValues = {
    search: "",
    page: 1
  }
  const [queryValues, setQueryValues] = useState(initialQueryValues)

  const debouncedSearchTerm = useDebounce(queryValues.search, 500);

  useEffect(() => {
    setIsSearching(true);
    getUsers()
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

  const getUsers = async (
    search=queryValues.search,
    page=queryValues.page
  ) => {
    let searchValue = search ? debouncedSearchTerm : ''
    const token = user.token ? user.token : getCookie("token")
    const query = `q=${searchValue}&page=${page}`
    const resp = await fetch(`http://localhost:3000/api/users?${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
        'all': true
      }
    })
    const json = await resp.json()

    setIsSearching(false);
    if (json.status == 200){
      dispatch(getUsersSuccess(json.users))
      setTotalEntries(json.total)
    } 
  }

  const columnHeaders = () => {
    return (
      <thead>
      <tr>
        <th>
          Username
        </th>
        <th>
          Email
        </th>
        <th>
          Role
        </th>
      </tr>
      </thead>
    )
  }

  const handleRole = (userRole) => (
    <>
      {<option value={userRole}>{roles[userRole]}</option>}
      {roles.map((val, i) => {
        if (i != userRole) return <option key={i} value={i}>{val}</option>
        })}
    </>
  )

  const handleSelect = (event, user) => {
    const { name } = event.target
    const { value } = event.target

    dispatch(userModified(user))
  }

  const handleSave = () => {
  }

  const renderTableData = () => {
    return allUsers.map((user, index) => {
      const {
         username, email, role } = user.attributes || {}
      return (
        <tr key={user.id}>
        <td>{titleize(username)}</td>
        <td>{titleize(email)}</td>
        <td> 
          <select name="role"
          className={utilStyles.statusSelect}
          onChange={(e) => handleSelect(e, user.id)}>
          {handleRole(role, user.id)}
          </select>
        </td>
          { user.changed &&
            <td><button onClick={handleSave}>Save</button></td>
          }
        </tr>
      )
    })
  }

  const search = (e) => {
    const { value } = e.target
    setQueryValues({...initialQueryValues, search: value})
  }

  const usersExist = () => {
    return !Boolean(
      allUsers.length < 1 && 
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

    usersExist() &&
    <div className={utilStyles.requestsView}>
      <div>
        <h3>Users.</h3>
        <form className={utilStyles.searchBox}>
          <input type="text" onChange={(e) => search(e)} placeholder="Search by Username or Email..." name="search"/>
        </form>

        {isSearching && <div>Getting Results...</div>}
        {
          allUsers.length ?
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
          : <p className={utilStyles.errorMessage}>No Users.</p>
        }
      </div>
    </div>
  )
}