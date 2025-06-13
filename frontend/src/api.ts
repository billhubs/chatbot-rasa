const BASE_URL = 'http://localhost:5000'

export async function fetchReservations() {
  const response = await fetch(BASE_URL + '/reservations/')
  if (!response.ok) throw new Error('Failed to fetch reservations')
  return response.json()
}

export async function fetchReports() {
  const response = await fetch(BASE_URL + '/api/reports')
  if (!response.ok) throw new Error('Failed to fetch reports')
  return response.json()
}
