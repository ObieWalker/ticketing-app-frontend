import { withFormik } from 'formik';
import * as yup from "yup"
import Register from '../../components/auth/registerForm'

const RegisterWrapper = Register
const RegisterValidation = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .min(5)
    .max(16)
    .required('Password is required.'),
    passwordConfirmation: yup
    .string()
    .min(5)
    .max(16)
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required(),
  username: yup
    .string()
    .min(5)
    .max(10)
    .required()
})

export default withFormik({
    handleSubmit: (values, { setSubmitting }) => {
    setTimeout(() => setSubmitting(false), 3 * 1000)
  },
  validationSchema: RegisterValidation,
})(RegisterWrapper)