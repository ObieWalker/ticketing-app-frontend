import httpClient from '../../helpers/httpClient'
import {asyncHandler} from '../../helpers/customMethods'

export default async (req, res) => {
  httpClient.setAuthorizationToken(req.headers.token)
  switch(req.method) {
    case 'POST':{
      const promise = httpClient.post("/requests", req.body)
      const { ok, response, error } = await asyncHandler(promise);
      if (ok) {
        const { data } = response
    
        res.json({
          request: data,
          status: 201
        })
      }
      else {
        res.json({
          message: error.response.data.message,
          status: error.response.status
        })
      }
      break
    }

    case 'GET': {
      let promise;
      if (req.headers.all){
        const query = `?q=${req.query.q}&page=${req.query.page}`
        promise =  httpClient.get(`/users${query}`)
      } else {
        promise = httpClient.get("/users/id")
      }

      const { ok, response, error } = await asyncHandler(promise);

      if (ok) {
        const { data , meta = {}} = response.data || {}
        res.json({
          users: data,
          status: 200,
          total: meta.total || {}
        })
      }
      else {
        res.json({
          message: error.response.data.message,
          status: error.response.status
        })
      }
      break
    }

    case 'PUT': {
      const promise = httpClient.put(`/requests/${req.query.id}`)
      const { ok, response, error } = await asyncHandler(promise);

      if (ok) {
        const { message } = response.data
        res.json({
          message,
          status: 200
        })
      }
      else {
        res.json({
          message: error.response.data.message,
          status: error.response.status
        })
      }
      break
    }
    default:
      res.status(405).end() //Method Not Allowed
      break
  }
}