'use client';

import { useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { EventType } from '@/lib/campaignPulseTypes';
import { EVENT_TYPE_CONFIG } from '@/lib/campaignPulseTypes';

interface Cluster {
  cluster_id: string;
  event_type: EventType;
  center_lat: number;
  center_lng: number;
  report_count: number;
  confidence_score: number;
  last_updated: string;
}

interface Props {
  clusters: Cluster[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const COLORS: Record<EventType, string> = {
  rally: '#22c55e',
  convoy: '#f97316',
  posters: '#eab308',
  door_to_door: '#3b82f6',
  giveaways: '#a855f7',
  intimidation: '#ef4444',
};

function createIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function CampaignPulseMapLeaflet({ clusters, selectedId, onSelect }: Props) {
  return (
    <MapContainer
      center={[-1.2921, 36.8219]}
      zoom={6}
      className="h-[400px] w-full z-0"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {clusters.map((c) => (
        <Marker
          key={c.cluster_id}
          position={[c.center_lat, c.center_lng]}
          icon={createIcon(COLORS[c.event_type])}
          eventHandlers={{
            click: () => onSelect(c.cluster_id),
          }}
        >
          <Popup>
            <div className="p-1">
              <p className="font-semibold">{EVENT_TYPE_CONFIG[c.event_type].label}</p>
              <p className="text-sm">Reports: {c.report_count} | Confidence: {c.confidence_score}%</p>
              <button
                type="button"
                onClick={() => onSelect(c.cluster_id)}
                className="text-green-600 text-sm mt-1 hover:underline"
              >
                View details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
