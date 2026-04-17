import { useMemo } from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"


export default function MapTDCP({ lat = 31.458294, lng = 74.263021 }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API || ""
  const TDCP_COORDS = { lat: Number(lat), lng: Number(lng) }
  
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  })

  const mapOptions = useMemo(
    () => ({
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    }),
    []
  )

  if (!apiKey) {
    return (
      <div className="w-full max-w-[625px] aspect-[625/545] rounded-lg grid place-items-center bg-gray-100 p-4">
        <p className="text-center">
          Add your Google Maps API key to{" "}
          <code>VITE_GOOGLE_MAPS_API</code> environment variable.
        </p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full max-w-[625px] aspect-[625/545] rounded-lg grid place-items-center bg-gray-100">
        Loading map…
      </div>
    )
  }

  return (
    <div className="w-full h-[400px] aspect-[625/545] rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={TDCP_COORDS}
        zoom={16}
        options={mapOptions}
      >
        <Marker position={TDCP_COORDS} />
      </GoogleMap>
    </div>
  )
}
