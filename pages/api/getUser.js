import httpClient from '../../helpers/httpClient'
import {asyncHandler} from '../../helpers/customMethods'

export default async (req, res) => {
  
  httpClient.setAuthorizationToken(req.headers.token)
  const promise = httpClient.get("/users/id")
  const { ok, response, error } = await asyncHandler(promise);

  if (ok) {
    const { attributes } = response.data.data
    res.json({
      user: attributes,
      status: 200
    })
  }
  else {
    res.json({
      message: error.response.data.message,
      status: error.response.status
    })
  }
}
