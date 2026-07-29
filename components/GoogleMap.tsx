// @ts-nocheck
// GoogleMap.tsx  •  cleaned & debugged
// Requires: npm i @types/google.maps  (or keep //ts-nocheck)

// Optional if you installed the types
/// <reference types="google.maps" />

import React, { useEffect, useRef, useState } from 'react';

interface MapDataPoint {
  lat: number;
  lng: number;
  id: number;
  type: string;
  severity: string;
}
interface GoogleMapProps {
  data: MapDataPoint[];
  mapCenter?: google.maps.LatLngLiteral;
  mapZoom?: number;
  onMarkerClick?: (incident: MapDataPoint) => void;
  showHeatmap?: boolean;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const GoogleMap: React.FC<GoogleMapProps> = ({
  data,
  mapCenter = { lat: 40.7589, lng: -73.9851 },
  mapZoom = 13,
  onMarkerClick,
  showHeatmap = true,
}) => {
  /** ---------- refs & state ---------- */
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map>();
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  /** ---------- load Maps JS once ---------- */
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing.');
      return;
    }

    if (window.google?.maps) {
      setMapsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // optional: remove script tag on unmount
      document.head.removeChild(script);
    };
  }, []);

  /** ---------- initialise map once ---------- */
  useEffect(() => {
    if (!mapsLoaded || !mapDivRef.current || mapRef.current) return;

    mapRef.current = new window.google.maps.Map(mapDivRef.current, {
      center: mapCenter,
      zoom: mapZoom,
    });
  }, [mapsLoaded, mapCenter, mapZoom]);

  /** ---------- update markers & heatmap whenever data changes ---------- */
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current) return;

    // ----- clear old markers and overlays -----
    markersRef.current.forEach(m => m.setMap(null));
    circlesRef.current.forEach(c => c.setMap(null));
    listenersRef.current.forEach(l => l.remove());
    markersRef.current = [];
    circlesRef.current = [];
    listenersRef.current = [];

    // ----- add new markers -----
    data.forEach(point => {
      const marker = new window.google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: mapRef.current!,
        title: point.type,
      });
      if (onMarkerClick) {
        listenersRef.current.push(
          marker.addListener('click', () => onMarkerClick(point)),
        );
      }
      markersRef.current.push(marker);
    });

    // ----- update heatmap-like circles -----
    if (showHeatmap && data.length) {
      data.forEach(point => {
        const severityColor = point.severity === 'HIGH'
          ? '#ef4444'
          : point.severity === 'MEDIUM'
            ? '#f59e0b'
            : '#10b981';

        const radius = point.severity === 'HIGH'
          ? 700
          : point.severity === 'MEDIUM'
            ? 500
            : 300;

        const circle = new window.google.maps.Circle({
          strokeColor: severityColor,
          strokeOpacity: 0.35,
          strokeWeight: 1,
          fillColor: severityColor,
          fillOpacity: 0.18,
          map: mapRef.current!,
          center: { lat: point.lat, lng: point.lng },
          radius,
        });

        circlesRef.current.push(circle);
      });
    }
  }, [data, onMarkerClick, mapsLoaded, showHeatmap]);

  /** ---------- cleanup on unmount ---------- */
  useEffect(() => {
    return () => {
      // Remove listeners
      listenersRef.current.forEach(l => l.remove());
      // Clear markers
      markersRef.current.forEach(m => m.setMap(null));
      // Clear circles
      circlesRef.current.forEach(c => c.setMap(null));
    };
  }, []);

  return <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />;
};

export default GoogleMap;
