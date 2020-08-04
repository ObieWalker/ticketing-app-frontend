import httpClient from '../../helpers/httpClient'
import {asyncHandler} from '../../helpers/customMethods'

export default async (req, res) => {
  httpClient.setAuthorizationToken(req.headers.token)
  switch(req.method) {
    case 'POST':{
      const promise = httpClient.post("/users", req.body)
      const { ok, response, error } = await asyncHandler(promise);

      if (ok) {
        const { attributes } = response.data.data
        res.setHeader('Set-Cookie', serialize('token', attributes.token, {
          // httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'none',
          maxAge: 86400,
          path: '/'
        }))
    
        httpClient.setAuthorizationToken(attributes.token)
        res.json({
          user: attributes,
          status: 201
        })
      } else {
        res.json({
          message: error.response.data.message,
          status: error.response.status
        })
      }
      break
    }

    case 'GET': {
      let promise;
      const { all } = req.headers
      if (all){
        const query = `?q=${req.query.q}&page=${req.query.page}`
        promise =  httpClient.get(`/users${query}`)
      } else {
        promise = httpClient.get("/users/id")
      }

      const { ok, response, error } = await asyncHandler(promise);

      if (ok) {
        const { data , meta = {}} = response.data || {}
        const returnObj = {
          users: (all ? data : undefined),
          user: (!all ? data.attributes : undefined),
          status: 200,
          total: (all ? meta.total || {} : undefined)
        }
        res.json(returnObj)
      } else {
        res.json({
          message: error.response.data.message,
          status: error.response.status
        })
      }
      break
    }

    case 'PUT': {
      const promise = httpClient.put(`/users/${req.query.userId}`, req.body)
      const { ok, response, error } = await asyncHandler(promise);

      if (ok) {
        const { message } = response.data
        res.json({
          message,
          status: 200
        })
      } else {
        res.json({
          message: error.response.data.message,
          status: error.response.status
        })
      }
      break
    }

    case 'DELETE': {
      const promise = httpClient.delete(`/users/${req.query.userId}`, req.body)
      const { ok, response, error } = await asyncHandler(promise);

      if (ok) {
        const { message } = response.data
        res.json({
          message,
          status: 200
        })
      } else {
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