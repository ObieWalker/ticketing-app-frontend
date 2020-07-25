import axios from 'axios';
import { serialize } from "cookie";
import httpClient from '../../helpers/httpClient'
import {asyncHandler} from '../../helpers/customMethods'

export default async function registerAuth(req, res) {

  const promise = httpClient.post("/users", req.body)
  const { ok, response, error } = await asyncHandler(promise);

  if (ok) {
    const { attributes } = response.data.data
    res.setHeader('Set-Cookie', serialize('token', attributes.token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
      maxAge: 3600,
      path: '/'
    }))
    httpClient.setAuthorizationToken(attributes.token)
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
}