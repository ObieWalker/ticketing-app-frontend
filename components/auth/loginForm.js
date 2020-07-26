import React, { PureComponent } from "react"
import { Form, Field, ErrorMessage } from "formik"
import utilStyles from '../../styles/utils.module.css'

export default function Login({errors, onSubmit, values, onChange}) {
  return (
    <form onSubmit={onSubmit}>
      <input
        className={utilStyles.formInput}
        placeholder="Email"
        type="text"
        name="email"
        onChange={onChange}
        defaultValue={values.email}
      />
      {errors.email && errors.email}
      <input
        className={utilStyles.formInput}
        placeholder="Password"
        type="password"
        name="password"
        onChange={onChange}
        defaultValue={values.password}
      />
      {errors.password && errors.password}
      <button className={utilStyles.formButton} type="submit">Login</button>
    </form>
  )
}