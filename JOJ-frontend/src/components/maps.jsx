import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

export default function Maps({latitude, longitude}) {
  const position = { lat: latitude, lng: longitude };
    const apikey = import.meta.env.VITE_MAPS_KEY
  return (
    <APIProvider apiKey = {apikey}>
        <Map defaultCenter={position} defaultZoom={13} gestureHandling={'greedy'} disableDefaultUI={false}>
          {/* Ajout d'un pointeur (location icon) sur la carte */}
          <Marker position={position} />
        </Map>
    </APIProvider>
  );
}

