/**
 * External dependencies
 */
// import classnames from 'classnames';
import {
	MapContainer,
	// TileLayer,
	// Marker,
	// Popup,
	useMap,
	// useMapEvents,
	ZoomControl,
	// FeatureGroup,
	// Marker,
	// Popup,
	// LayersControl,
} from 'react-leaflet'
import L from 'leaflet';
import 'leaflet-providers';
import {
	// useRef,
	useContext,
	useEffect,
  	useState,
} from 'react';

/**
 * Internal dependencies
 */
import {
    defaultPosition,
} from '../constants';
import { ContextLayers } from '../Context';
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

const TileLayerProvider = ( {
	providerVariant,	// required
	providerOptions,
} ) => {
	const {
		layersForControl,
		setLayersForControl,
	} = useContext( ContextLayers );
	const map = useMap();
	useEffect( () => {
		if ( ! layersForControl.base[providerVariant] ) {
			// Init layer, but do not add to map.
			const layer = L.tileLayer.provider( providerVariant, providerOptions );
			// Add new layer to layersForControl.base
			const newLayersForControl = {
				...layersForControl,
				base: {
					...layersForControl.base,
					[providerVariant]: layer,
				},
			};
			setLayersForControl( newLayersForControl );
		}
	}, [layersForControl] );

	useEffect( () => {
		if ( Object.keys( layersForControl.base ).length ) {
			// Set first layer active
			const isOneLayerOnMap = Object.keys( layersForControl.base ).reduce( ( acc, layerKey ) => acc ? acc : !! map.hasLayer( layersForControl.base[layerKey] ), false );
			if ( ! isOneLayerOnMap ) {
				layersForControl.base[Object.keys( layersForControl.base )[0]].addTo( map );
			}
		}
	}, [layersForControl] );

	return null;
};

const LayersControl = () => {
	const map = useMap();
	const { layersForControl } = useContext( ContextLayers );
	useEffect( () => {
		let layerControl;
		if ( Object.keys( layersForControl.base ).length || Object.keys( layersForControl.overlay ).length ) {
			// Init control and add to map
			layerControl = L.control.layers( layersForControl.base, layersForControl.overlay );
			layerControl.addTo( map );
		}
		return () => {
			if ( layerControl ) {
				map.removeControl( layerControl );
			}
		};
	}, [layersForControl] );

	return null;
};

const ImageLayer = ( {
	imageUrl,		// required
	latLngBounds,	// required
	altText,
	errorOverlayUrl,
} ) => {
	const {
		layersForControl,
		setLayersForControl,
	} = useContext( ContextLayers );
	errorOverlayUrl = errorOverlayUrl ? errorOverlayUrl : 'https://cdn-icons-png.flaticon.com/512/110/110686.png';

	const key = 'ImageLayer' + '+' + imageUrl;

	useEffect( () => {
		if ( ! layersForControl.overlay[key] ) {
			latLngBounds = Array.isArray( latLngBounds ) ? L.latLngBounds( latLngBounds ) : latLngBounds;
			const layer = L.imageOverlay( imageUrl, latLngBounds, {
				opacity: 0.8,
				errorOverlayUrl: errorOverlayUrl,
				alt: altText,
			} );
			// Add new layer to layersForControl.overlay.
			const newLayersForControl = {
				...layersForControl,
				overlay: {
					...layersForControl.overlay,
					[key]: layer,
				},
			};
			setLayersForControl( newLayersForControl );
		}
	}, [layersForControl] );

	return null;
};

const WmsLayer = ( {
	url,			// required
	options,
} ) => {
	const {
		layersForControl,
		setLayersForControl,
	} = useContext( ContextLayers );

	const key = 'WmsLayer' + '+' + options.layers + '+' + url;

	useEffect( () => {
		if ( ! layersForControl.overlay[key] ) {
			const layer = L.tileLayer.wms( url, options );
			// Add new layer to layersForControl.overlay.
			const newLayersForControl = {
				...layersForControl,
				overlay: {
					...layersForControl.overlay,
					[key]: layer,
				},
			};
			setLayersForControl( newLayersForControl );
		}
	}, [layersForControl] );

	return null;
};

const Map = () => {

	const [layersForControl,setLayersForControl] = useState( {
		base: {},
		overlay: {},
	} );

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

			<ContextLayers.Provider value={ {
				layersForControl,
				setLayersForControl,
			} }>

				{ [
					'OpenStreetMap.Mapnik',
					'Stamen.Watercolor',
					'Esri.WorldImagery',
					'Esri.WorldPhysical',
				].reverse().map( layerKey => <TileLayerProvider
					key={ layerKey }
					providerVariant={ layerKey }
				/> ) }

				<ImageLayer
					imageUrl={ '/static/icon-d2_germany_regular-lat-lon_single-level_2023071000_048_2d_tot_prec.png' }
					latLngBounds={ [
						[29.5,	-23.5],
						[70.5, 	62.5 ],
					] }
				/>

				<WmsLayer
					url={ 'http://ows.mundialis.de/services/service?' }
					options={ {
						layers: 'SRTM30-Colored-Hillshade',
					} }
				/>

				{/* Unfortunately only old data available  */}
				{/* <WmsLayer
					url={ 'https://geoportal.dwd-cloud.de/wms/icon-eu/wms?' }
					options={ {
						layers: 'tp',
						uppercase: true,
						format: 'image/png',
						version: '1.3.0',
						tiled: true,
						time: '2022-08-03T09:00:00.000Z',
						transparent: true,
					} }
				/> */}

				{/* Example for WmsLayer for our local skinnyWms tile server */}
				{/* <WmsLayer
					url={ 'http://localhost:5000/wms?' }
					options={ {
						layers: 'tp',
						uppercase: false,
						format: 'image/png',
						version: '1.3.0',
						time: '2023-07-19T17:15:00.000Z',
						transparent: true,
					} }
				/> */}

				<LayersControl/>

			</ContextLayers.Provider>

			<FullscreenControl position="topright" />

			<MapInvalidateSize style={ style } />

			<ZoomControl position="topright" />

		</MapContainer>
    </div>;
}

export default Map;