export const handleRoute = (id) => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  // Format dates as YYYY-MM-DD
  const checkInDate = today.toISOString().split("T")[0]
  const checkOutDate = tomorrow.toISOString().split("T")[0]

  const url = `https://resorts.tdcp.gop.pk/hoteldetail?AccommodationId=${id}&checkIn=${checkInDate}&checkOut=${checkOutDate}`

  window.scrollTo(0, 0)

  // open in new tab
  window.open(url, "_blank")
}
