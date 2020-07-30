import React from "react"
import utilStyles from '../../styles/utils.module.css'


export default function Register({errors, onSubmit, values, onChange}) {
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
          placeholder="Username"
          type="text"
          name="username"
          onChange={onChange}
          defaultValue={values.username}
        />
        {errors.username && errors.username}
        <input
          className={utilStyles.formInput}
          placeholder="Password"
          type="password"
          name="password"
          onChange={onChange}
          defaultValue={values.password}
        />
        {errors.password && errors.password}
        <input
          className={utilStyles.formInput}
          placeholder="Confirm Password"
          type="password"
          name="passwordConfirmation"
          onChange={onChange}
          defaultValue={values.passwordConfirmation}
        />
        {errors.passwordConfirmation && errors.passwordConfirmation}
        <button className={utilStyles.formButton} type="submit">Register</button>
      </form>
    )
}