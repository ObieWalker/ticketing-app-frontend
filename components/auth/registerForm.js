import React, { PureComponent } from "react"
import { Form, Field, ErrorMessage } from "formik"
import utilStyles from '../../styles/utils.module.css'

export default class Register extends PureComponent {
  render() {
    return (
      <Form className={utilStyles.formField}>
        <Field className={utilStyles.formInput} type="text" name="username" placeholder="username" />
        <ErrorMessage className={utilStyles.errorInput}  name="username" />        
        <Field className={utilStyles.formInput} type="text" name="email" placeholder="email" />
        <ErrorMessage className={utilStyles.errorInput}  name="email" />
        <Field className={utilStyles.formInput} type="password" name="password" placeholder="password" />
        <ErrorMessage name="password" />
        <Field className={utilStyles.formInput} type="password" name="passwordConfirmation" placeholder="confirm password" />
        <ErrorMessage name="passwordConfirmation" />
        <button className={utilStyles.formButton} type="submit"> Submit </button>
      </Form>
    )
  }
}