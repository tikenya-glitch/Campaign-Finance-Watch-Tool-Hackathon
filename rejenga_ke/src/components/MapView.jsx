/**
 * MapView.jsx
 * Central map component powered by deck.gl + MapLibre GL.
 *
 * Layers:
 *  1. HeatmapLayer  – county-level funding concentration
 *  2. ScatterplotLayer – donor and candidate nodes
 *  3. ArcLayer – animated donation flows (donor → candidate)
 *
 * Animation: a requestAnimationFrame loop increments `animTick`; ArcLayer
 * uses this to modulate arc opacity/width producing a pulsing "money flow" effect.
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { Map } from 'react-map-gl/maplibre';
import MapTooltip from './MapTooltip';
import { partyColor, donorTypeColor, formatKES } from '../utils/dataHelpers';

// Kenya centroid
const INITIAL_VIEW_STATE = {
  longitude: 37.9062,
  latitude: -0.0236,
  zoom: 5.8,
  pitch: 30,
  bearing: 0,
};

// Free CARTO dark basemap – no API key required
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export default function MapView({
  arcData,
  heatmapData,
  donorScatter,
  candidateScatter,
  suspiciousFlags,
  showHeatmap,
  showFlows,
  onSelectEntity,
}) {
  const [tooltip, setTooltip] = useState(null);
  const animTickRef = useRef(0);
  const [animTick, setAnimTick] = useState(0);
  const rafRef = useRef(null);

  // Animation loop – runs at ~30 fps to drive arc pulsing
  useEffect(() => {
    let lastTime = 0;
    const animate = (time) => {
      if (time - lastTime > 33) {
        animTickRef.current += 1;
        setAnimTick(animTickRef.current);
        lastTime = time;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // -----------------------------------------------------------------------
  // Tooltip handlers
  // -----------------------------------------------------------------------
  const handleArcHover = useCallback(({ object, x, y }) => {
    if (!object) { setTooltip(null); return; }
    setTooltip({
      x, y,
      type: 'arc',
      data: {
        donor: object.donor.name,
        donorType: object.donor.type,
        candidate: object.candidate.name,
        party: object.candidate.party,
        county: object.candidate.county,
        amount: formatKES(object.amount),
        date: object.date,
      },
    });
  }, []);

  const handleDonorHover = useCallback(({ object, x, y }) => {
    if (!object) { setTooltip(null); return; }
    const flag = suspiciousFlags[object.id];
    setTooltip({
      x, y,
      type: 'donor',
      data: {
        name: object.name,
        type: object.type,
        county: object.county,
        total: formatKES(object.total_donations),
        suspicious: !!flag,
        flagReasons: flag?.reasons ?? [],
      },
    });
  }, [suspiciousFlags]);

  const handleCandidateHover = useCallback(({ object, x, y }) => {
    if (!object) { setTooltip(null); return; }
    setTooltip({
      x, y,
      type: 'candidate',
      data: {
        name: object.name,
        party: object.party,
        position: object.position,
        county: object.county,
      },
    });
  }, []);

  const handleDonorClick = useCallback(({ object }) => {
    if (object) onSelectEntity({ entity: object, type: 'donor' });
  }, [onSelectEntity]);

  const handleCandidateClick = useCallback(({ object }) => {
    if (object) onSelectEntity({ entity: object, type: 'candidate' });
  }, [onSelectEntity]);

  // -----------------------------------------------------------------------
  // Layer definitions
  // -----------------------------------------------------------------------
  const layers = [];

  // 1. Heatmap layer
  if (showHeatmap && heatmapData.length > 0) {
    layers.push(
      new HeatmapLayer({
        id: 'heatmap',
        data: heatmapData,
        getPosition: (d) => d.position,
        getWeight: (d) => d.weight,
        radiusPixels: 80,
        intensity: 1.2,
        threshold: 0.05,
        colorRange: [
          [255, 255, 178, 180],
          [254, 204,  92, 200],
          [253, 141,  60, 210],
          [240,  59,  32, 220],
          [189,   0,  38, 240],
        ],
      })
    );
  }

  // 2. Animated arc layer – money flow
  if (showFlows && arcData.length > 0) {
    // Pulsing opacity: each arc has a phase offset based on its index
    // so they don't all pulse in unison
    const tick = animTickRef.current;
    layers.push(
      new ArcLayer({
        id: 'money-flow-arcs',
        data: arcData,
        getSourcePosition: (d) => d.sourcePosition,
        getTargetPosition: (d) => d.targetPosition,
        getSourceColor: (d, { index }) => {
          const phase = (tick * 0.05 + index * 0.7) % (Math.PI * 2);
          const alpha = Math.round(100 + Math.sin(phase) * 80);
          return [...d.color, alpha];
        },
        getTargetColor: (d, { index }) => {
          const phase = (tick * 0.05 + index * 0.7) % (Math.PI * 2);
          const alpha = Math.round(200 + Math.sin(phase) * 55);
          return [255, 255, 255, alpha];
        },
        getWidth: (d, { index }) => {
          const phase = (tick * 0.05 + index * 0.7) % (Math.PI * 2);
          return d.width * (0.8 + Math.sin(phase) * 0.2);
        },
        getHeight: 0.35,
        getTilt: 0,
        greatCircle: false,
        pickable: true,
        onHover: handleArcHover,
        updateTriggers: {
          getSourceColor: [tick],
          getTargetColor: [tick],
          getWidth: [tick],
        },
      })
    );
  }

  // 3. Donor scatter
  layers.push(
    new ScatterplotLayer({
      id: 'donors',
      data: donorScatter,
      getPosition: (d) => d.position,
      getRadius: (d) => d.radius,
      getFillColor: (d) => {
        const flag = suspiciousFlags[d.id];
        return flag ? [239, 68, 68, 220] : [...d.color, 200];
      },
      getLineColor: (d) => {
        const flag = suspiciousFlags[d.id];
        return flag ? [239, 68, 68, 255] : [...d.color, 255];
      },
      lineWidthMinPixels: 2,
      stroked: true,
      pickable: true,
      onHover: handleDonorHover,
      onClick: handleDonorClick,
      radiusUnits: 'meters',
    })
  );

  // 4. Candidate scatter
  layers.push(
    new ScatterplotLayer({
      id: 'candidates',
      data: candidateScatter,
      getPosition: (d) => d.position,
      getRadius: 8000,
      getFillColor: (d) => [...d.color, 180],
      getLineColor: (d) => [...d.color, 255],
      lineWidthMinPixels: 1.5,
      stroked: true,
      pickable: true,
      onHover: handleCandidateHover,
      onClick: handleCandidateClick,
      radiusUnits: 'meters',
    })
  );

  // 5. Labels for donors
  layers.push(
    new TextLayer({
      id: 'donor-labels',
      data: donorScatter,
      getPosition: (d) => d.position,
      getText: (d) => d.name.split(' ')[0],
      getSize: 11,
      getColor: [200, 210, 255, 200],
      getPixelOffset: [0, -28],
      fontFamily: 'Inter, sans-serif',
      fontWeight: '500',
      characterSet: 'auto',
      sizeUnits: 'pixels',
    })
  );

  // 6. Labels for candidates (abbreviated)
  layers.push(
    new TextLayer({
      id: 'candidate-labels',
      data: candidateScatter,
      getPosition: (d) => d.position,
      getText: (d) => d.name.split(' ')[0],
      getSize: 10,
      getColor: (d) => [...partyColor(d.party), 200],
      getPixelOffset: [0, 22],
      fontFamily: 'Inter, sans-serif',
      fontWeight: '400',
      characterSet: 'auto',
      sizeUnits: 'pixels',
    })
  );

  return (
    <div className="relative flex-1">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={{ doubleClickZoom: false }}
        layers={layers}
        onViewStateChange={() => setTooltip(null)}
      >
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>

      {/* Overlay tooltip */}
      {tooltip && <MapTooltip tooltip={tooltip} />}

      {/* Map legend (bottom-left) */}
      <MapLegend />

      {/* Suspicious donor count badge */}
      <div className="absolute bottom-6 right-4 flex flex-col gap-2 pointer-events-none">
        <div className="bg-surface-card/90 backdrop-blur border border-surface-border rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-500 mb-1">Active Flows</p>
          <p className="text-lg font-bold text-accent-blue">{arcData.length}</p>
        </div>
      </div>
    </div>
  );
}

function MapLegend() {
  return (
    <div className="absolute bottom-6 left-4 bg-surface-card/90 backdrop-blur border border-surface-border rounded-lg p-3 pointer-events-none">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Legend</p>
      <div className="flex flex-col gap-1.5">
        {[
          { color: '#4f8ef7', label: 'Corporate Donor' },
          { color: '#f97316', label: 'Individual Donor' },
          { color: '#a855f7', label: 'Organisation Donor' },
          { color: '#ef4444', label: 'Suspicious Donor' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2" style={{ borderColor: color, backgroundColor: color + '33' }} />
            <span className="text-[10px] text-gray-400">{label}</span>
          </div>
        ))}
        <div className="h-px bg-surface-border my-1" />
        <p className="text-[9px] text-gray-600">Arc thickness = donation size</p>
        <p className="text-[9px] text-gray-600">Heatmap = county funding density</p>
      </div>
    </div>
  );
}
