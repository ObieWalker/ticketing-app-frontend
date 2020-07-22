import React, { PureComponent } from "react"
import { Form, Field, ErrorMessage } from "formik"
import utilStyles from '../../styles/utils.module.css'

export default function Login () {
    return (
      <form 
      >
      <input
        className={utilStyles.formInput}
        type="text"
        name="email"
      />
      {errors.email && errors.email}
      <input
        className={utilStyles.formInput}
        type="password"
        name="password"
      />
      {errors.password && errors.password}
      <button className={utilStyles.formButton} type="submit">Login</button>
    </form>
    )
}