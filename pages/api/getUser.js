import httpClient from '../../helpers/httpClient'
import {asyncHandler} from '../../helpers/customMethods'

export default async function getUser(req, res) {
  
  // console.log("req.headers>>>", req.headers)
  const promise = httpClient.get("/users/id")
  const { ok, response, error } = await asyncHandler(promise);

  if (ok) {
    res.status(200).json({
      user: response.data.user,
    })
  }
  else {
    res.status(error.response.status).json({
      message: error.response.data.message,
      status: error.response.status
    })
  }
}

export {
  getUser
}