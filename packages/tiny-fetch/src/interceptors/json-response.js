const jsonResponse = {
  response(response) {
    if (response.status === 204 || response.status === 201)
      return JSON.stringify({ headers: response.headers, status: response.status })
    return response.text().then((text) => {
      try {
        return { headers: response.headers, status: response.status, data: JSON.parse(text) }
      } catch (err) {
        return text
      }
    })
  },
  id: 'TINY_FETCH_JSON_RESPONSE',
}

export default jsonResponse
