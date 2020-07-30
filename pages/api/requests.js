import axios from 'axios';
import { serialize } from "cookie";
import httpClient from '../../helpers/httpClient'
import {asyncHandler} from '../../helpers/customMethods'

export default async (req, res) => {
  switch(req.method) {
    case 'POST':{
      const promise = httpClient.post("/requests", req.body)
      const { ok, response, error } = await asyncHandler(promise);
      if (ok) {
        const { attributes } = response.data.data
    
        res.json({
          user: attributes,
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
      const query = `q=${req.query.q}&status=${req.query.status}`
      const promise = httpClient.get(`/requests?${query}`)
      const { ok, response, error } = await asyncHandler(promise);

      if (ok) {
        const { data } = response.data

        res.json({
          requests: data,
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

  }
}