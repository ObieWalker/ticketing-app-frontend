export async function asyncHandler(promise) {
  return promise
    .then(response => ({
      ok: true,
      response,
      error: {}
    }))
    .catch(error => ({
      ok: false,
      response: {},
      error,
    }));
}

export function getToken() {
  const token = localStorage.getItem('token')
  if (token) return token
  return
}