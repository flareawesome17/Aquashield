import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import municipalBoundary from "../../../municipal-boundary.json";
import marineHotzones from "../../../marine-hotzones";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZmxhcmVhd2Vzb21lIiwiYSI6ImNtOGR5MDh0MTAxMWoya3B2NG5iZTU3NHUifQ.3-Nca-D--n-gTft7zjjRdw";

interface FisherFolk {
  id: number;
  image: string;
  name: string;
  role: string;
  latitude: number;
  longitude: number;
}

const LiveTracking = ({ selectedFisher }: { selectedFisher: FisherFolk | null }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    if (mapContainer.current && !mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [123.692, 8.611],
        zoom: 10,
      });

      mapRef.current = map;

      map.on("load", () => {
        // Municipal boundary
        map.addSource("municipal-boundary", {
          type: "geojson",
          data: municipalBoundary,
        });

        map.addLayer({
          id: "municipal-boundary-line",
          type: "line",
          source: "municipal-boundary",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#2563EB",
            "line-width": 4,
            "line-opacity": 0.8,
          },
        });

        // Marine Hotzones
        map.addSource("marine-hotzones", {
          type: "geojson",
          data: marineHotzones,
        });

        map.addLayer({
          id: "hotzones-fill",
          type: "fill",
          source: "marine-hotzones",
          paint: {
            "fill-color": "#10B981",
            "fill-opacity": 0.4,
          },
        });

        map.addLayer({
          id: "hotzones-outline",
          type: "line",
          source: "marine-hotzones",
          paint: {
            "line-color": "#047857",
            "line-width": 2,
          },
        });

        map.addLayer({
          id: "hotzones-label",
          type: "symbol",
          source: "marine-hotzones",
          layout: {
            "text-field": ["get", "name"],
            "text-size": 12,
            "text-offset": [0, 1.2],
            "text-anchor": "top",
          },
          paint: {
            "text-color": "#065F46",
          },
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!selectedFisher || !mapRef.current) return;

    const map = mapRef.current;

    map.flyTo({
      center: [selectedFisher.longitude, selectedFisher.latitude],
      zoom: 12,
      essential: true,
    });

    // Cleanup old marker and popup
    if (markerRef.current) markerRef.current.remove();
    if (popupRef.current) popupRef.current.remove();

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div style="font-family: sans-serif; text-align: center;">
        <img 
          src="${selectedFisher.image}" 
          alt="${selectedFisher.name}" 
          style="display: block; margin: 0 auto 6px; width: 40px; height: 40px; object-fit: cover; border-radius: 50%;"
        />
        <div><strong>${selectedFisher.name}</strong></div>
        <div>${selectedFisher.role}</div>
      </div>
    `);

    popupRef.current = popup;

    const marker = new mapboxgl.Marker({ color: "#EF4444" })
      .setLngLat([selectedFisher.longitude, selectedFisher.latitude])
      .setPopup(popup)
      .addTo(map);

    // Ensure popup opens on click
    marker.getElement().addEventListener("click", () => {
      popup.addTo(map);
    });

    markerRef.current = marker;
  }, [selectedFisher]);

  return <div ref={mapContainer} style={{ height: "500px", width: "100%" }} />;
};

export default LiveTracking;
