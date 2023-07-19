

/**
 * External dependencies
 */

// import classnames from 'classnames';
import {
	MapContainer,
	TileLayer,
	// Marker,
	// Popup,
	useMap,
	// useMapEvents,
	ZoomControl,
	// FeatureGroup,
} from 'react-leaflet'
// import L from 'leaflet';

import {
	// useRef,
	useEffect,
  // useState,
} from 'react';

/**
 * Internal dependencies
 */
import {
    defaultPosition,
} from '../constants';
import FullscreenControl from './FullscreenControl.jsx';
import useStyleMaxElementHeight from '../compose/useStyleMaxElementHeight';

/**
 * Invalidate map size on window height changes.
 *
 */
const MapInvalidateSize = ( { style } ) => {
  const map = useMap();
  useEffect( () => {
      map.invalidateSize();
  }, [style.height] );
  return null
}

const Map = () => {

    const style = useStyleMaxElementHeight();

    return <div
        className={ 'map-wrapper' }
        style={ style }
    >
            <MapContainer
                center={ defaultPosition }
                zoom={ 8 }
                zoomSnap={ 0.1 }
                zoomControl={ false }
                closePopupOnClick={ false }
            >
                <FullscreenControl position="topright" />

                <MapInvalidateSize style={ style } />

                <ZoomControl position="topright" />

                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

            </MapContainer>
    </div>;
}

export default Map;