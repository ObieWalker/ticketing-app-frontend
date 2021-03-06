import React from "react"
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import Loader from 'react-loader-spinner'
import utilStyles from '../../styles/utils.module.css';
import userStyles from '../../styles/users.module.css';
import { titleize } from '../../utils/formatUtil';
import { getCookie } from '../../utils/cookieUtil';
import useDebounce from '../../lib/hooks/use-debounce';
import {
  getUsersSuccess,
  userModified,
  deleteUserSuccess,
} from '../../lib/actions/usersAction'
import { roles } from '../../lib/constants/enumConstant';
import NavigateButtons from '../buttons/NavigateButtons';
import {usersColumnHeaders} from '../tables/TableColumns';

export default function Users() {

  const dispatch =  useDispatch();

  const { user } = useSelector(state => state.user)
  const { allUsers } = useSelector(state => state.users)

  const [isSearching, setIsSearching] = useState(false);
  const [nextButton, setNextButton] = useState(true)
  const [previousButton, setPreviousButton] = useState(false)
  const [totalEntries, setTotalEntries] = useState(null)

  const initialQueryValues = {
    search: "",
    page: 1
  }
  const [userRole, setUserRole] = useState(null)
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
    const resp = await fetch(`${process.env.API_SERVER}api/users?${query}`, {
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

  const handleSave = async (
    userId,
    role = userRole
  ) => {
    dispatch(userModified())
    const token = user.token ? user.token : getCookie("token")
    const resp = await fetch(`${process.env.API_SERVER}api/users?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token
      },
      body: JSON.stringify({
        role
      })
    })
    const json = await resp.json()
    if (json.status == 200) {
      toast.success(json.message)
    } else {
      toast.error(json.message)
    }
  }

  const handleDelete = (
    userId,
  ) => {
    confirmAlert({
      title: 'Delete User',
      message: 'Are you sure to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleClickDelete(userId)
        },
        {
          label: 'No',
          onClick: () => close()
        }
      ]
    });
  }

  const handleClickDelete = async (id) => {
    const token = user.token ? user.token : getCookie("token")
    const resp = await fetch(`${process.env.API_SERVER}api/users?userId=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token
      }
    })
    const json = await resp.json()
    if (json.status == 200) {
      dispatch(deleteUserSuccess(id))
      getUsers()
      toast.success(json.message)
    } else {
      toast.error(json.message)
    }
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
    const { value } = event.target

    setUserRole(value)
    dispatch(userModified(user))
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
          className={userStyles.userStatusSelect}
          onChange={(e) => handleSelect(e, user.id)}>
          {handleRole(role, user.id)}
          </select>
        </td>
          { user.changed ?
            <td><button className={utilStyles.saveButton}
              onClick={() => handleSave(user.id)}>Save</button>
            </td>
            :
            <td><button className={userStyles.deleteButton}
              onClick={() => handleDelete(user.id)}>Delete</button>
            </td>
          }
        </tr>
      )
    })
  }

  const search = (e) => {
    const { value } = e.target
    setQueryValues({...initialQueryValues, search: value})
  }

  const previousPage = () => {
    setQueryValues({...queryValues, page: queryValues.page - 1})
  }
  
  const nextPage = () => {
    setQueryValues({...queryValues, page: queryValues.page + 1})
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
      <div className={userStyles.usersView}>
        <div>
          <h3>Users.</h3>
          <form className={utilStyles.searchBox}>
            <input type="text" onChange={(e) => search(e)}
              placeholder="Search by Username or Email..." name="search"
            />
          </form>

          {isSearching &&
            <Loader
              type="ThreeDots"
              color="#4699B3"
              height={50}
              width={50}
            />
          }
          {
            allUsers.length ?
            <>
              <NavigateButtons
                previousPage={previousPage}
                nextPage={nextPage}
                previousButton={previousButton}
                nextButton={nextButton}
              />
            <table className={userStyles.usersTable}>
              {usersColumnHeaders()}
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