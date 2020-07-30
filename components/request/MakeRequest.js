import React from "react"
import { useState } from 'react';
import Router from 'next/router'
import cookie from 'js-cookie';
import { useFormik } from 'formik';
import * as yup from "yup"
import { useDispatch } from 'react-redux'
import { createRequestSuccess, createRequestFailure } from '../../lib/actions/requestActions'
import utilStyles from '../../styles/utils.module.css'

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
  const [requestError, setRequestError] = useState(null)

  const createRequest = async (values) => {
    dispatch(createRequestSuccess(values))

    const request = {
      request_title: values.title,
      request_body: values.description
    }
    const resp = await fetch('http://localhost:3000/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        request: request
      })
    })
    const json = await resp.json()

    if (json.status == 201) {
      //notification
    } else {
      dispatch(createRequestFailure(json))
      //notification
      setRequestError(json.message)
    }
  }

  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: { title: '', description: '' },
    validationSchema,
    onSubmit(values){ createRequest(values)}

  })
  return (
    <div style={{ textAlign: 'center'}}>
      <h3>Make a request.</h3>
      <p className={utilStyles.errorMessage}>
        {requestError && requestError}
      </p>
      <form onSubmit={handleSubmit} className={utilStyles.requestForm}>
        <input
          className={utilStyles.requestTitle}
          placeholder="Title"
          type="text"
          name="title"
          onChange={handleChange}
          defaultValue={values.title}
        />
        <span className={utilStyles.inputErrorMessage}> 
         {errors.title && errors.title}
        </span>
        <textarea
          className={utilStyles.requestInput}
          placeholder="Request Details"
          type="text"
          name="description"
          onChange={handleChange}
          defaultValue={values.description}
        />
        <span className={utilStyles.inputErrorMessage}>
          {errors.description && errors.description}
        </span>

        <button className={utilStyles.formButton} type="submit">Submit Request</button>
      </form>
    </div>
  )
}