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
