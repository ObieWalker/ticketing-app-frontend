import React from "react"
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as yup from "yup"
import { useDispatch, useSelector } from 'react-redux'
import { createRequestSuccess, createRequestFailure } from '../../lib/actions/requestActions'
import utilStyles from '../../styles/utils.module.css'
import requestsStyles from '../../styles/requests.module.css'

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .required("A title is required"),
  description: yup
    .string()
    .min(10, "Your description must be longer.")
    .required("Your description must be longer.")
})


export default function MakeRequest() {

  const dispatch =  useDispatch();
  const { user } = useSelector(state => state.user)
  const { token } = user
  
  const createRequest = async (request) => {

    const attributes = {
      request_title: request.title,
      request_body: request.description,
      status: 'unresponded',
      created_at: (new Date).toString(),
      username: user.username
    }

    dispatch(createRequestSuccess({attributes}))

    const resp = await fetch(`${process.env.API_SERVER}api/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         token
      },
      body: JSON.stringify({
        request: attributes
      })
    })
    const json = await resp.json()

    if (json.status != 201) {
      dispatch(createRequestFailure(json))
      toast.error(json.message)
    }
  }

  const { resetForm, handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: { title: '', description: '' },
    validationSchema,
    onSubmit(values){
      createRequest(values)
      resetForm()
    }
  })
  return (
    <div style={{ textAlign: 'center'}}>
      <h3>Make a request.</h3>
      <form onSubmit={handleSubmit} className={requestsStyles.requestForm}>
        <input
          className={requestsStyles.requestTitle}
          placeholder="Title"
          type="text"
          name="title"
          onChange={handleChange}
          value={values.title || ''}
        />
        <span className={utilStyles.inputErrorMessage}> 
         {errors.title && errors.title}
        </span>
        <textarea
          className={requestsStyles.requestInput}
          placeholder="Request Details"
          type="text"
          name="description"
          onChange={handleChange}
          value={values.description || ''}
        />
        <span className={utilStyles.inputErrorMessage}>
          {errors.description && errors.description}
        </span>

        <button className={utilStyles.formButton} type="submit">Submit Request</button>
      </form>
    </div>
  )
}