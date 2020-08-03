import axios from 'axios';
import { serialize } from "cookie";
import httpClient from '../../helpers/httpClient'
import {asyncHandler} from '../../helpers/customMethods'

export default async (req, res) => {
  httpClient.setAuthorizationToken(req.headers.token)
  switch(req.method) {
    case 'POST': {
      const postPromise = httpClient.post("/comments", req.body)
      const { ok, response, error } = await asyncHandler(postPromise);
      if (ok) {
        const { data } = response
    
        res.json({
          commentResponse: data,
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
      const query = `request_id=${req.query.requestId}`
      const getPromise = httpClient.get(`/comments?${query}`)
      const { ok, response, error } = await asyncHandler(getPromise);

      if (ok) {
        const { data } = response

        res.json({
          comments: data,
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