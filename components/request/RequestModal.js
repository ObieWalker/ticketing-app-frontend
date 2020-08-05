import React, { useState } from "react"
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik';
import {toast} from 'react-toastify';
import { createCommentSuccess, createCommentFailure } from '../../lib/actions/commentActions'
import { updateRequestStatus } from '../../lib/actions/requestActions';
import {formatDate, titleize} from '../../utils/formatUtil';
import utilStyles from '../../styles/utils.module.css'
import modalStyles from '../../styles/modal.module.css'

export default function RequestModal({ handleClose, show, children, comments, user }) {

  const dispatch =  useDispatch();

  const { request_title, id, request_body, created_at, username, status, agent_assigned } = children?.attributes || {}

  const handleCommenter = (commenterId) => {
    if (commenterId == agent_assigned) return "Agent"
    return `${titleize(username)}`
  }

  const submitComment = async (post) => {
    post.user_id = user.user_id
    dispatch(createCommentSuccess(post))
    dispatch(updateRequestStatus(children.id))

    const resp = await fetch(`${process.env.API_SERVER}api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: user.token
      },
      body: JSON.stringify({
        comment: {
          request_id: children.id,
          comment: post.comment
        }
      })
    })
    const json = await resp.json()

    if (json.status != 201) {
      dispatch(createCommentFailure())
      toast.error(json.message)
    }
  }

  const { resetForm, handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: { comment: '' },
    onSubmit(values){ 
      submitComment(values)
      resetForm()
      handleClose()
    }
  })

  const renderCommentBox = (role, commentLength) => {
    return !Boolean(role == 2 && !commentLength)
  }

  return (
    <div className={show ? utilStyles.showClass : utilStyles.hideClass}>
      <section className={modalStyles.modalMain}>
      <span className={modalStyles.modalCustomerName}>Customer Name: {titleize(username)}</span>
        <button className={modalStyles.closeModal} onClick={() => {handleClose(); resetForm();}}>X</button>
        <span>{formatDate(created_at)}</span>
        <hr />
        <h2>{request_title}</h2>
        <div className={modalStyles.modalRequest}>{request_body}</div>
          { comments && comments.length > 0 &&
          
            <div className={modalStyles.commentsBox}>
              {
                comments.map((comment, i) => (
                  <React.Fragment key={i}>
                    <span>{comment.comment}</span>
                    <span> - {handleCommenter(comment.user_id)}</span>
                    <hr />
                  </React.Fragment>
                ))
              }
            </div>
          }
        { renderCommentBox(user.role, comments.length) &&
          <form onSubmit={handleSubmit}>

          <textarea
            className={modalStyles.commentBox}
            placeholder="Comment"
            type="text"
            name="comment"
            onChange={handleChange}
            value={values.comment || ''}
          />
          <span className={utilStyles.inputErrorMessage}>
            {errors.description && errors.description}
          </span>
  
            <button disabled={!values.comment} 
            className={values.comment ? modalStyles.modalButton : modalStyles.disabledModalButton}
            >Post</button>
          </form>
        }
      </section>
    </div>
  )
}