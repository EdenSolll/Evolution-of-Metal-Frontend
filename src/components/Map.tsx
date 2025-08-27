import { useEffect, useMemo, useRef } from 'react'
import L, { ImageOverlay, Map } from 'leaflet'
import './map.css'
import { Genre, get_Genres,
    get_Genre_Songs,
} from '../data/api_requests'
import { trackState } from './AudioPlayer'
import'leaflet-textpath'

// Define constants
const MAP_WIDTH = 540
const MAP_HEIGHT = 540
const MAX_YEAR = 2024
const MIN_YEAR = 1970

const calculateCoordinate = (
    year: number,
    minYear: number,
    maxYear: number,
    mapWidth: number
): number => {
    return (year - minYear) * (mapWidth / (maxYear - minYear))
}

export default function MapComponent(): JSX.Element {
    const imageOverlay = useRef<ImageOverlay | null>(null)
    const mapContainer = useRef<Map | null>(null)
    const audioPlayerState = trackState();

    const drawGenreLines = useMemo(() => {
        return (map: Map) => {
            map.eachLayer((layer) => {
                if (layer instanceof L.Polyline) {
                    map.removeLayer(layer)
                }
            })

            get_Genres().then((genres) => {
                genres.forEach((genre) => {
                    drawGenreLine(genre, map)
                    drawSongLines(genre, map)
                })
            })
        }
    }, [])

    const drawSongLines = (genre: Genre, map: Map) => {
        get_Genre_Songs(genre.id).then((song) => {
            song.forEach((song) => {
            const xCoordinateStart = calculateCoordinate(
                song.year,
                MIN_YEAR,
                MAX_YEAR,
                MAP_WIDTH
            )
            const xCoordinateEnd = calculateCoordinate(
                song.year,
                MIN_YEAR,
                MAX_YEAR,
                MAP_WIDTH
            )
            const polylineCoordinates: L.LatLngTuple[] = [
                [genre.y_axis, xCoordinateStart],
                [genre.y_axis, xCoordinateEnd + 9],
            ]

            const songline = L.polyline(polylineCoordinates, {
                color: genre.color,
                weight: 6,
                lineCap: "square"
            }).addTo(map)

            songline.on('click', function () {
                audioPlayerState.newMapSong = song;
            })
         })
         }).catch((error) => {
           console.error('Error:', error);
           });
    }

    useEffect(() => {
        if (!mapContainer.current) {
            try {
                const map = setupMap()

                if (imageOverlay.current) {
                    map.removeLayer(imageOverlay.current)
                }

                imageOverlay.current = addImageOverlay(map)

                drawGenreLines(map)

                const yearLayers = addYearMarkers(map)

                handleZoomEvents(map, yearLayers)

                map.fire('zoomend')
                mapContainer.current = map
            } catch (error) {
                console.error(
                    'There has been a problem with your fetch operation:',
                    error
                )
            }
        }
    }, [])

    return (
        <div
            id="map"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: 'calc(100vh - 60px)',
                width: '100%',
            }}
        />
    )
}

function drawGenreLine(genre: Genre, map: Map) {
    const genreCoordinateStart = calculateCoordinate(
        genre.start_year,
        MIN_YEAR,
        MAX_YEAR,
        MAP_WIDTH
    )
    const genreCoordinateEnd = calculateCoordinate(
        MAX_YEAR,
        MIN_YEAR,
        MAX_YEAR,
        MAP_WIDTH
    )

    const genreMidPoint = calculateCoordinate(
        genre.start_year + (MAX_YEAR - genre.start_year) / 2,
        MIN_YEAR,
        MAX_YEAR,
        MAP_WIDTH
    )
    const baseLineCoordinates: L.LatLngTuple[] = [
        [genre.y_axis, genreCoordinateStart],
        [genre.y_axis, genreCoordinateEnd],
    ]

    const baseLineMidPoint: L.LatLngExpression = [
      genre.y_axis, genreMidPoint
    ]
    L.polyline(baseLineCoordinates, {
        color: genre.color,
        weight: 5,
        opacity: 0.5,
        lineCap: "square"
    }).addTo(map)

    L.marker(baseLineMidPoint, {
      icon: L.divIcon({
        className: 'genre-label',
        html: `<div>${genre.genre}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 20]
      })
    }).addTo(map)

}

function setupMap(): Map {
    return L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 3.5,
        zoomSnap: 0.1,
        zoomDelta: 0.1,
        attributionControl: false,
    }).setView([200, 225], 0)
}

function addImageOverlay(map: Map): ImageOverlay {
    const imageUrl =
        'https://www.metal-archives.com/images/6/6/6/6/666668.jpg?0304'
    const bounds: L.LatLngTuple[] = [
        [0, 0],
        [MAP_HEIGHT, MAP_WIDTH],
    ]

    return L.imageOverlay(imageUrl, bounds).addTo(map)
}

function addYearMarkers(map: Map) {
    const yearLayers: Record<number, { marker: L.Marker, line: L.Polyline }> = {};
    for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
        // Create year marker
        const yearMarker = L.marker([0, (year - MIN_YEAR) * 10], {
            icon: L.divIcon({
                className: 'leaflet-marker-icon',
                html: `<div class="year">${year}</div>`,
                iconSize: [200, 40],
                iconAnchor: [15, 0],
            }),
        }).addTo(map);

        // Create year line
        let yearLineCoordinates: L.LatLngTuple[];
        if (year % 10 == 0) {
          yearLineCoordinates = [
              [0, (year - MIN_YEAR) * 10],
              [10, (year - MIN_YEAR) * 10],
          ];
        } else {
          yearLineCoordinates = [
              [0, (year - MIN_YEAR) * 10],
              [5, (year - MIN_YEAR) * 10],
          ];
        }
        const yearLine = L.polyline(yearLineCoordinates, {
            color: "red",
            weight: 6,
            lineCap: "square"
        }).addTo(map);

        let baseLineCoords: L.LatLngTuple[];

        baseLineCoords = [
            [0, 0],
            [0, ((MAX_YEAR - MIN_YEAR) * 10)]
        ];

        L.polyline(baseLineCoords, {
            color: "red",
            weight: 6,
            lineCap: "square"
        }).addTo(map);


        // Store both marker and line
        yearLayers[year] = { marker: yearMarker, line: yearLine};
    }
    return yearLayers;
}

function handleZoomEvents(map: Map, yearLayers: Record<number, { marker: L.Marker, line: L.Polyline }>) {
    const updateVisibility = () => {
        const zoom = map.getZoom();
        for (const yearStr in yearLayers) {
            const year = parseInt(yearStr);
            const { marker, line } = yearLayers[year];

            if (zoom >= 2) {
                // Show both marker and line for all years
                if (!map.hasLayer(marker)) marker.addTo(map);
                if (!map.hasLayer(line)) line.addTo(map);
            } else {
                if (year % 10 !== 0) {
                    // Remove non-decade years
                    if (map.hasLayer(marker)) map.removeLayer(marker);
                    if (map.hasLayer(line)) map.removeLayer(line);
                } else {
                    // Ensure decade years are visible
                    if (!map.hasLayer(marker)) marker.addTo(map);
                    if (!map.hasLayer(line)) line.addTo(map);
                }
            }
        }
    };

    map.on('zoomend', updateVisibility);
    updateVisibility();
}
