import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Globe2,
  MapPin,
  Phone,
  Store,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { Button } from "../components/UI/Button";
import { Reveal } from "../components/UI/Reveal";
import { SectionHeader } from "../components/UI/SectionHeader";
import { useSiteContent } from "../contexts/SiteContentContext";
import {
  businessHoursToMultiline,
  useLocationsPageContent,
} from "../sanity/publicContent";

interface LocationData {
  id: string;
  name: string;
  region: string;
  city: string;
  mapUrl: string;
  address: string;
  image: string;
  galleryImages: {
    src: string;
    alt: string;
  }[];
  phone?: string;
  hours?: string;
  latitude: number;
  longitude: number;
  markerOffsetX?: number;
  markerOffsetY?: number;
}

type MapCoordinate = [number, number];
type MarkerSpreadOffset = {
  x: number;
  y: number;
};

const MAP_VIEWPORT = {
  width: 860,
  height: 980,
  minLongitude: 6.2,
  maxLongitude: 19.4,
  minLatitude: 36.2,
  maxLatitude: 47.4,
} as const;

const MAP_LATITUDE_LINES = [37, 39, 41, 43, 45, 47];
const MAP_LONGITUDE_LINES = [7, 9, 11, 13, 15, 17, 19];
const MARKER_CLUSTER_THRESHOLD_PX = 34;

const MAP_LANDMASSES: MapCoordinate[][] = [
  [
    [15.520376, 38.231155],
    [15.160243, 37.444046],
    [15.309898, 37.134219],
    [15.099988, 36.619987],
    [14.335229, 36.996631],
    [13.826733, 37.104531],
    [12.431004, 37.61295],
    [12.570944, 38.126381],
    [13.741156, 38.034966],
    [14.761249, 38.143874],
    [15.520376, 38.231155],
  ],
  [
    [9.210012, 41.209991],
    [9.809975, 40.500009],
    [9.669519, 39.177376],
    [9.214818, 39.240473],
    [8.806936, 38.906618],
    [8.428302, 39.171847],
    [8.388253, 40.378311],
    [8.159998, 40.950007],
    [8.709991, 40.899984],
    [9.210012, 41.209991],
  ],
  [
    [12.376485, 46.767559],
    [13.806475, 46.509306],
    [13.69811, 46.016778],
    [13.93763, 45.591016],
    [13.141606, 45.736692],
    [12.328581, 45.381778],
    [12.383875, 44.885374],
    [12.261453, 44.600482],
    [12.589237, 44.091366],
    [13.526906, 43.587727],
    [14.029821, 42.761008],
    [15.14257, 41.95514],
    [15.926191, 41.961315],
    [16.169897, 41.740295],
    [15.889346, 41.541082],
    [16.785002, 41.179606],
    [17.519169, 40.877143],
    [18.376687, 40.355625],
    [18.480247, 40.168866],
    [18.293385, 39.810774],
    [17.73838, 40.277671],
    [16.869596, 40.442235],
    [16.448743, 39.795401],
    [17.17149, 39.4247],
    [17.052841, 38.902871],
    [16.635088, 38.843572],
    [16.100961, 37.985899],
    [15.684087, 37.908849],
    [15.687963, 38.214593],
    [15.891981, 38.750942],
    [16.109332, 38.964547],
    [15.718814, 39.544072],
    [15.413613, 40.048357],
    [14.998496, 40.172949],
    [14.703268, 40.60455],
    [14.060672, 40.786348],
    [13.627985, 41.188287],
    [12.888082, 41.25309],
    [12.106683, 41.704535],
    [11.191906, 42.355425],
    [10.511948, 42.931463],
    [10.200029, 43.920007],
    [9.702488, 44.036279],
    [8.888946, 44.366336],
    [8.428561, 44.231228],
    [7.850767, 43.767148],
    [7.435185, 43.693845],
    [7.549596, 44.127901],
    [7.007562, 44.254767],
    [6.749955, 45.028518],
    [7.096652, 45.333099],
    [6.802355, 45.70858],
    [6.843593, 45.991147],
    [7.273851, 45.776948],
    [7.755992, 45.82449],
    [8.31663, 46.163642],
    [8.489952, 46.005151],
    [8.966306, 46.036932],
    [9.182882, 46.440215],
    [9.922837, 46.314899],
    [10.363378, 46.483571],
    [10.442701, 46.893546],
    [11.048556, 46.751359],
    [11.164828, 46.941579],
    [12.153088, 47.115393],
    [12.376485, 46.767559],
  ],
];

const isOpenNow = () => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const morningOpen = 9 * 60 + 30;
  const morningClose = 13 * 60;
  const afternoonOpen = 16 * 60 + 30;
  const afternoonClose = 20 * 60 + 30;

  return (
    (minutes >= morningOpen && minutes <= morningClose) ||
    (minutes >= afternoonOpen && minutes <= afternoonClose)
  );
};

const projectLongitude = (longitude: number) =>
  ((longitude - MAP_VIEWPORT.minLongitude) /
    (MAP_VIEWPORT.maxLongitude - MAP_VIEWPORT.minLongitude)) *
  MAP_VIEWPORT.width;

const projectLatitude = (latitude: number) =>
  ((MAP_VIEWPORT.maxLatitude - latitude) /
    (MAP_VIEWPORT.maxLatitude - MAP_VIEWPORT.minLatitude)) *
  MAP_VIEWPORT.height;

const polygonToPoints = (coordinates: MapCoordinate[]) =>
  coordinates
    .map(
      ([longitude, latitude]) =>
        `${projectLongitude(longitude)},${projectLatitude(latitude)}`,
    )
    .join(" ");

const buildGoogleMapsHref = ({
  mapUrl,
  name,
  address,
  city,
  region,
  latitude,
  longitude,
}: {
  mapUrl: string;
  name: string;
  address: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
}) => {
  const hasValidCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    !(latitude === 0 && longitude === 0);

  if (hasValidCoordinates) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }

  const query = [name, address, city, region].filter(Boolean).join(", ");
  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  return mapUrl;
};

const getMarkerPosition = (location: LocationData) => {
  const leftPercent =
    ((location.longitude - MAP_VIEWPORT.minLongitude) /
      (MAP_VIEWPORT.maxLongitude - MAP_VIEWPORT.minLongitude)) *
    100;
  const topPercent =
    ((MAP_VIEWPORT.maxLatitude - location.latitude) /
      (MAP_VIEWPORT.maxLatitude - MAP_VIEWPORT.minLatitude)) *
    100;

  return {
    leftPercent,
    topPercent,
    x: projectLongitude(location.longitude),
    y: projectLatitude(location.latitude),
  };
};

const buildMarkerSpreadOffsets = (locations: LocationData[]) => {
  const renderedMarkers = locations.map((location) => {
    const markerPosition = getMarkerPosition(location);
    return {
      location,
      renderedX: markerPosition.x + (location.markerOffsetX ?? 0),
      renderedY: markerPosition.y + (location.markerOffsetY ?? 0),
    };
  });

  const spreadOffsets = new Map<string, MarkerSpreadOffset>();
  const visited = new Set<string>();

  for (const marker of renderedMarkers) {
    if (visited.has(marker.location.id)) continue;

    const cluster = [];
    const stack = [marker];
    visited.add(marker.location.id);

    while (stack.length) {
      const current = stack.pop();
      if (!current) continue;
      cluster.push(current);

      for (const candidate of renderedMarkers) {
        if (visited.has(candidate.location.id)) continue;

        const distance = Math.hypot(
          candidate.renderedX - current.renderedX,
          candidate.renderedY - current.renderedY,
        );

        if (distance <= MARKER_CLUSTER_THRESHOLD_PX) {
          visited.add(candidate.location.id);
          stack.push(candidate);
        }
      }
    }

    if (cluster.length < 2) continue;

    const sortedCluster = [...cluster].sort((a, b) =>
      a.location.name.localeCompare(b.location.name),
    );
    const radius = Math.min(28, 10 + sortedCluster.length * 4);

    sortedCluster.forEach((entry, index) => {
      const angle =
        -Math.PI / 2 + (index * (2 * Math.PI)) / sortedCluster.length;

      spreadOffsets.set(entry.location.id, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
    });
  }

  return spreadOffsets;
};

const buildNetworkPath = (locations: LocationData[]) => {
  if (locations.length < 2) {
    return "";
  }

  return [...locations]
    .sort((a, b) => b.latitude - a.latitude)
    .map((location, index) => {
      const point = getMarkerPosition(location);
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ");
};

const resetMarkerTransform = "translate(-50%, -50%)";
const sharedLocationImage = {
  src: "/images/sedi.jpeg",
  alt: "Dimensione Immagine sedi",
};

export const Locations: React.FC = () => {
  const location = useLocation();
  const content = useLocationsPageContent();
  const { siteSettings, storeLocations } = useSiteContent();
  const locations = useMemo<LocationData[]>(
    () =>
      storeLocations.map((store) => ({
        id: store.id,
        name: store.name,
        region: store.region,
        city: store.city,
        mapUrl: buildGoogleMapsHref({
          mapUrl: store.mapUrl,
          name: store.name,
          address: store.address,
          city: store.city,
          region: store.region,
          latitude: store.latitude,
          longitude: store.longitude,
        }),
        address: store.address,
        image: sharedLocationImage.src,
        galleryImages: [
          {
            src: sharedLocationImage.src,
            alt: `${store.name} - ${sharedLocationImage.alt}`,
          },
        ],
        phone: store.phone || undefined,
        hours: businessHoursToMultiline(store.hours),
        latitude: store.latitude,
        longitude: store.longitude,
        markerOffsetX: store.markerOffsetX,
        markerOffsetY: store.markerOffsetY,
      })),
    [storeLocations],
  );
  const regions = useMemo(
    () => [
      "Tutte",
      ...Array.from(new Set(locations.map((store) => store.region))).sort(
        (a, b) => a.localeCompare(b),
      ),
    ],
    [locations],
  );
  const [selectedRegion, setSelectedRegion] = useState("Tutte");
  const [selectedLocationId, setSelectedLocationId] = useState(
    locations[0]?.id ?? "",
  );
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [cardGalleryIndices, setCardGalleryIndices] = useState<
    Record<string, number>
  >({});

  const filteredLocations = useMemo(() => {
    return [...locations]
      .filter((store) => {
        return selectedRegion === "Tutte" || store.region === selectedRegion;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [locations, selectedRegion]);

  useEffect(() => {
    if (!filteredLocations.length) {
      setSelectedLocationId("");
      return;
    }

    if (!filteredLocations.some((store) => store.id === selectedLocationId)) {
      setSelectedLocationId(filteredLocations[0].id);
    }
  }, [filteredLocations, selectedLocationId]);

  useEffect(() => {
    setSelectedGalleryIndex(0);
  }, [selectedLocationId]);

  const selectedLocation =
    filteredLocations.find((store) => store.id === selectedLocationId) ??
    filteredLocations[0] ??
    null;

  const selectedGalleryImages = selectedLocation?.galleryImages || [];
  const selectedGalleryImage =
    selectedGalleryImages[selectedGalleryIndex] ||
    (selectedLocation
      ? {
          src: selectedLocation.image,
          alt: `Sede ${selectedLocation.name}`,
        }
      : null);

  const activeRegionCount = new Set(
    filteredLocations.map((store) => store.region),
  ).size;
  const networkPath = useMemo(
    () => buildNetworkPath(filteredLocations),
    [filteredLocations],
  );
  const markerSpreadOffsets = useMemo(
    () => buildMarkerSpreadOffsets(filteredLocations),
    [filteredLocations],
  );
  const currentlyOpen = isOpenNow();

  const resetFilters = () => {
    setSelectedRegion("Tutte");
  };

  const goToPreviousGalleryImage = () => {
    if (selectedGalleryImages.length <= 1) return;

    setSelectedGalleryIndex((current) =>
      current === 0 ? selectedGalleryImages.length - 1 : current - 1,
    );
  };

  const goToNextGalleryImage = () => {
    if (selectedGalleryImages.length <= 1) return;

    setSelectedGalleryIndex((current) => (current + 1) % selectedGalleryImages.length);
  };

  const getCardGalleryIndex = (store: LocationData) => {
    if (store.galleryImages.length <= 1) return 0;

    const rawIndex = cardGalleryIndices[store.id] ?? 0;
    return ((rawIndex % store.galleryImages.length) + store.galleryImages.length) %
      store.galleryImages.length;
  };

  const getCardGalleryImage = (store: LocationData) =>
    store.galleryImages[getCardGalleryIndex(store)] || {
      src: store.image,
      alt: `Sede ${store.name}`,
    };

  const changeCardGalleryImage = (store: LocationData, direction: -1 | 1) => {
    if (store.galleryImages.length <= 1) return;

    setSelectedLocationId(store.id);
    setCardGalleryIndices((current) => {
      const previousIndex = current[store.id] ?? 0;
      const nextIndex =
        (previousIndex + direction + store.galleryImages.length) %
        store.galleryImages.length;

      return {
        ...current,
        [store.id]: nextIndex,
      };
    });
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title={content.seo.title}
        description={content.seo.description}
        url={`${siteSettings.siteUrl}${location.pathname}`}
        image={content.seo.image?.src}
        noIndex={content.seo.noIndex}
        siteUrl={siteSettings.siteUrl}
        siteName={siteSettings.siteName}
      />

      <section className="container mx-auto px-4 sm:px-6 py-12 md:py-20 text-center">
        <Reveal width="100%">
          <SectionHeader
            label={content.heroLabel}
            title={content.heroTitle}
            subtitle={content.heroSubtitle}
            as="h1"
          />
        </Reveal>
      </section>

      <section className="container mx-auto px-4 sm:px-6 mb-12">
        <Reveal width="100%">
          <div className="rounded-[28px] border border-brand-border bg-white px-5 py-6 shadow-[0_18px_60px_rgba(17,17,17,0.06)] sm:px-6">
            <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
              <div className="xl:max-w-xs">
                <div className="inline-flex items-center gap-2 text-brand-text-primary">
                  <Filter size={18} className="text-brand-accent" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                    Filtri attivi
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
                  Filtra per regione per aggiornare la mappa e la selezione dei
                  negozi in tempo reale.
                </p>
              </div>

              <div className="flex-1">
                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
                    Regione
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => {
                      const isActive = selectedRegion === region;
                      return (
                        <button
                          key={region}
                          type="button"
                          onClick={() => setSelectedRegion(region)}
                          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            isActive
                              ? "border-brand-accent bg-brand-accent text-white"
                              : "border-brand-border bg-white text-brand-text-primary hover:border-brand-accent hover:text-brand-accent"
                          }`}
                        >
                          {region}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 xl:w-[18rem]">
                <div className="rounded-2xl border border-brand-border bg-brand-bg px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-brand-text-secondary">
                    Totale
                  </p>
                  <p className="mt-3 font-serif text-3xl text-brand-text-primary">
                    {filteredLocations.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-border bg-brand-bg px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-brand-text-secondary">
                    Regioni
                  </p>
                  <p className="mt-3 font-serif text-3xl text-brand-text-primary">
                    {activeRegionCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container mx-auto mb-16 px-4 sm:px-6">
        <div className="mx-auto grid max-w-[92rem] gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.92fr)] xl:items-center 2xl:gap-8">
          <Reveal width="100%" className="h-full">
            <div className="relative h-full overflow-hidden rounded-[32px] border border-brand-gold/20 bg-[#060606] p-5 shadow-[0_28px_80px_rgba(17,17,17,0.24)] sm:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,155,94,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(184,155,94,0.12),transparent_28%)]" />

              <div className="relative z-10 flex h-full flex-col gap-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold/65">
                      {content.mapEyebrow}
                    </span>
                    <h2 className="mt-3 font-serif text-3xl text-white sm:text-[2.35rem]">
                      {content.mapTitle}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-gold/78 sm:text-base">
                      {content.mapDescription}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/15 bg-white/5 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-gold/75">
                    <Globe2 size={14} />
                    Italia
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[26px] border border-brand-gold/12 bg-[#080808] p-3 sm:p-4">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02),transparent_55%)]" />

                  <div className="relative mx-auto aspect-[7/8] w-full max-w-[43rem] overflow-hidden rounded-[22px] border border-brand-gold/10 bg-[#090909] md:aspect-[7/7.75] xl:aspect-[7/7.2]">
                    <svg
                      viewBox={`0 0 ${MAP_VIEWPORT.width} ${MAP_VIEWPORT.height}`}
                      className="absolute inset-0 h-full w-full"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient
                          id="networkRouteGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="rgba(184,155,94,0.12)" />
                          <stop
                            offset="50%"
                            stopColor="rgba(184,155,94,0.45)"
                          />
                          <stop
                            offset="100%"
                            stopColor="rgba(184,155,94,0.12)"
                          />
                        </linearGradient>
                      </defs>

                      {MAP_LONGITUDE_LINES.map((line) => {
                        const x = projectLongitude(line);
                        return (
                          <line
                            key={`longitude-${line}`}
                            x1={x}
                            x2={x}
                            y1={0}
                            y2={MAP_VIEWPORT.height}
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="1"
                          />
                        );
                      })}

                      {MAP_LATITUDE_LINES.map((line) => {
                        const y = projectLatitude(line);
                        return (
                          <line
                            key={`latitude-${line}`}
                            x1={0}
                            x2={MAP_VIEWPORT.width}
                            y1={y}
                            y2={y}
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="1"
                          />
                        );
                      })}

                      {MAP_LANDMASSES.map((landmass, index) => (
                        <polygon
                          key={`landmass-${index}`}
                          points={polygonToPoints(landmass)}
                          fill="rgba(184,155,94,0.16)"
                          stroke="rgba(184,155,94,0.2)"
                          strokeWidth="1.2"
                        />
                      ))}

                      {networkPath && (
                        <path
                          d={networkPath}
                          fill="none"
                          stroke="url(#networkRouteGradient)"
                          strokeWidth="2"
                          strokeDasharray="8 10"
                          strokeLinecap="round"
                        />
                      )}

                      {filteredLocations.map((store) => {
                        const markerPosition = getMarkerPosition(store);
                        const markerSpread = markerSpreadOffsets.get(
                          store.id,
                        ) || { x: 0, y: 0 };
                        const isSelected = selectedLocation?.id === store.id;
                        const connectorX =
                          markerPosition.x +
                          (store.markerOffsetX ?? 0) +
                          markerSpread.x;
                        const connectorY =
                          markerPosition.y +
                          (store.markerOffsetY ?? 0) +
                          markerSpread.y;

                        return (
                          <g key={`connector-${store.id}`}>
                            {(store.markerOffsetX ||
                              store.markerOffsetY ||
                              markerSpread.x ||
                              markerSpread.y) && (
                              <line
                                x1={markerPosition.x}
                                y1={markerPosition.y}
                                x2={connectorX}
                                y2={connectorY}
                                stroke={
                                  isSelected
                                    ? "rgba(184,155,94,0.9)"
                                    : "rgba(184,155,94,0.42)"
                                }
                                strokeWidth={isSelected ? "2.4" : "1.7"}
                                strokeLinecap="round"
                              />
                            )}
                            <circle
                              cx={markerPosition.x}
                              cy={markerPosition.y}
                              r={isSelected ? "5.2" : "4.1"}
                              fill={
                                isSelected
                                  ? "rgba(184,155,94,1)"
                                  : "rgba(184,155,94,0.86)"
                              }
                              stroke="rgba(9,9,9,0.95)"
                              strokeWidth="2.4"
                            />
                          </g>
                        );
                      })}
                    </svg>

                    <div className="absolute inset-0">
                      {filteredLocations.map((store, index) => {
                        const markerPosition = getMarkerPosition(store);
                        const markerSpread = markerSpreadOffsets.get(
                          store.id,
                        ) || { x: 0, y: 0 };
                        const isSelected = selectedLocation?.id === store.id;

                        return (
                          <a
                            key={store.id}
                            href={store.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={() => setSelectedLocationId(store.id)}
                            onFocus={() => setSelectedLocationId(store.id)}
                            aria-label={`Apri ${store.name} su Google Maps`}
                            className="absolute z-10"
                            style={{
                              left: `calc(${markerPosition.leftPercent}% + ${
                                (store.markerOffsetX ?? 0) + markerSpread.x
                              }px)`,
                              top: `calc(${markerPosition.topPercent}% + ${
                                (store.markerOffsetY ?? 0) + markerSpread.y
                              }px)`,
                              transform: resetMarkerTransform,
                              zIndex: isSelected ? 30 : 20 + index,
                            }}
                          >
                            <span className="relative flex h-12 w-12 items-center justify-center">
                              {isSelected && (
                                <span className="absolute h-12 w-12 rounded-full bg-brand-gold/25 animate-ping" />
                              )}
                              <span
                                className={`relative flex h-9 w-9 items-center justify-center rounded-full border text-[11px] font-semibold shadow-lg transition-all duration-300 ${
                                  isSelected
                                    ? "border-brand-gold bg-brand-gold text-brand-text-primary"
                                    : "border-white/35 bg-[#111111]/92 text-brand-gold hover:border-brand-gold hover:bg-brand-gold/12"
                                }`}
                              >
                                {index + 1}
                              </span>
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal
            width="100%"
            className="h-full xl:flex xl:items-center xl:justify-center"
            delay={0.08}
          >
            {selectedLocation ? (
              <div className="flex h-full w-full max-w-[32rem] flex-col overflow-hidden rounded-[32px] border border-brand-border bg-white shadow-[0_28px_80px_rgba(17,17,17,0.1)] xl:min-h-[42rem]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0a0a0a]">
                  {selectedGalleryImage && (
                    <img
                      src={selectedGalleryImage.src}
                      alt={selectedGalleryImage.alt || `Sede ${selectedLocation.name}`}
                      className="h-full w-full object-contain object-center p-6 sm:p-7"
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1280px) 32vw, 100vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-text-primary backdrop-blur-sm">
                    <span>{selectedLocation.region}</span>
                    <span className="h-1 w-1 rounded-full bg-brand-accent" />
                    <span>{selectedLocation.city}</span>
                  </div>
                  {selectedGalleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={goToPreviousGalleryImage}
                        className="absolute left-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-brand-text-primary shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
                        aria-label="Immagine precedente"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={goToNextGalleryImage}
                        className="absolute right-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-brand-text-primary shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
                        aria-label="Immagine successiva"
                      >
                        <ChevronRight size={18} />
                      </button>
                      <div className="absolute bottom-4 right-4 rounded-full bg-black/58 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                        {selectedGalleryIndex + 1} / {selectedGalleryImages.length}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex grow flex-col p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex rounded-full border border-brand-accent/20 bg-brand-accent/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
                      {currentlyOpen ? "Aperto ora" : "Chiuso ora"}
                    </span>
                  </div>

                  <h2 className="mt-5 font-serif text-3xl leading-tight text-brand-text-primary">
                    {selectedLocation.name}
                  </h2>

                  <p className="mt-3 text-base leading-relaxed text-brand-text-secondary">
                    {selectedLocation.city}, {selectedLocation.region}
                  </p>

                  <div className="mt-8 space-y-5 border-t border-brand-border pt-6">
                    <div className="flex items-start gap-3">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-brand-accent"
                      />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
                          Indirizzo
                        </p>
                        <p className="mt-1 leading-relaxed text-brand-text-primary">
                          {selectedLocation.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Store
                        size={18}
                        className="mt-0.5 shrink-0 text-brand-accent"
                      />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
                          Orari
                        </p>
                        <p className="mt-1 whitespace-pre-line leading-relaxed text-brand-text-primary">
                          {selectedLocation.hours}
                        </p>
                      </div>
                    </div>

                    {selectedLocation.phone && (
                      <div className="flex items-start gap-3">
                        <Phone
                          size={18}
                          className="mt-0.5 shrink-0 text-brand-accent"
                        />
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
                            Telefono
                          </p>
                          <a
                            href={`tel:${selectedLocation.phone}`}
                            className="mt-1 inline-flex leading-relaxed text-brand-text-primary transition-colors hover:text-brand-accent"
                          >
                            {selectedLocation.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={selectedLocation.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-text-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold transition-colors hover:bg-black"
                    >
                      Apri su Google Maps
                      <ExternalLink size={14} />
                    </a>

                    {selectedLocation.phone && (
                      <a
                        href={`tel:${selectedLocation.phone}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-text-primary transition-colors hover:border-brand-accent hover:text-brand-accent"
                      >
                        Chiama il negozio
                        <Phone size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[24rem] w-full max-w-[32rem] flex-col items-center justify-center rounded-[32px] border border-dashed border-brand-border bg-white px-6 py-10 text-center xl:min-h-[42rem]">
                <p className="font-serif text-2xl text-brand-text-primary">
                  Nessun punto vendita trovato
                </p>
                <p className="mt-3 max-w-md text-brand-text-secondary">
                  I filtri selezionati non mostrano sedi disponibili. Resettali
                  per tornare alla mappa completa.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={resetFilters}
                >
                  Resetta filtri
                </Button>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 pb-24">
        <Reveal width="100%">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-accent">
                {content.listEyebrow}
              </span>
              <h2 className="mt-3 font-serif text-3xl text-brand-text-primary">
                {content.listTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-brand-text-secondary">
                {content.listDescription}
              </p>
            </div>

            {selectedRegion !== "Tutte" && (
              <Button variant="outline" onClick={resetFilters}>
                Resetta filtri
              </Button>
            )}
          </div>
        </Reveal>

        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredLocations.map((store, index) => {
              const isSelected = selectedLocation?.id === store.id;
              const currentCardImage = getCardGalleryImage(store);
              const currentCardGalleryIndex = getCardGalleryIndex(store);

              return (
                <Reveal
                  key={store.id}
                  width="100%"
                  delay={(index % 3) * 0.08}
                  fullHeight
                >
                  <article
                    onMouseEnter={() => setSelectedLocationId(store.id)}
                    onFocusCapture={() => setSelectedLocationId(store.id)}
                    onClick={() => setSelectedLocationId(store.id)}
                    className={`group flex h-full flex-col overflow-hidden rounded-[28px] border bg-white transition-all duration-300 ${
                      isSelected
                        ? "border-brand-gold shadow-[0_20px_60px_rgba(17,17,17,0.12)]"
                        : "border-brand-border hover:-translate-y-1 hover:border-brand-gold/45 hover:shadow-[0_20px_60px_rgba(17,17,17,0.08)]"
                    }`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0a]">
                      <img
                        src={currentCardImage.src}
                        alt={currentCardImage.alt || `Sede ${store.name}`}
                        className="h-full w-full object-contain object-center p-5 transition-transform duration-700 group-hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute left-4 top-4 flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/92 text-xs font-semibold text-brand-text-primary">
                          {index + 1}
                        </span>
                        <span className="rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                          {store.region}
                        </span>
                      </div>
                      {store.galleryImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              changeCardGalleryImage(store, -1);
                            }}
                            className="absolute left-4 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-brand-text-primary shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
                            aria-label={`Immagine precedente per ${store.name}`}
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              changeCardGalleryImage(store, 1);
                            }}
                            className="absolute right-4 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-brand-text-primary shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
                            aria-label={`Immagine successiva per ${store.name}`}
                          >
                            <ChevronRight size={16} />
                          </button>
                          <div className="absolute bottom-4 right-4 rounded-full bg-black/58 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                            {currentCardGalleryIndex + 1} / {store.galleryImages.length}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex grow flex-col px-5 py-5 sm:px-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                            currentlyOpen
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {currentlyOpen ? "Aperto ora" : "Chiuso ora"}
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.2em] text-brand-text-secondary">
                          {store.city}
                        </span>
                      </div>

                      <h3 className="mt-4 font-serif text-2xl leading-tight text-brand-text-primary">
                        {store.name}
                      </h3>

                      <div className="mt-5 space-y-4 text-sm text-brand-text-secondary">
                        <div className="flex items-start gap-3">
                          <MapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-brand-accent"
                          />
                          <span className="leading-relaxed">
                            {store.address}
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <Store
                            size={16}
                            className="mt-0.5 shrink-0 text-brand-accent"
                          />
                          <span className="whitespace-pre-line leading-relaxed">
                            {store.hours}
                          </span>
                        </div>

                      </div>

                      <div className="mt-auto pt-6">
                        <a
                          href={store.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent transition-colors hover:text-brand-text-primary"
                        >
                          Apri su Google Maps
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-brand-border bg-white px-6 py-16 text-center">
            <p className="font-serif text-3xl text-brand-text-primary">
              Nessun punto vendita trovato
            </p>
            <p className="mt-3 text-brand-text-secondary">
              Nessuna sede corrisponde ai filtri selezionati.
            </p>
            <Button variant="outline" className="mt-6" onClick={resetFilters}>
              Resetta filtri
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
