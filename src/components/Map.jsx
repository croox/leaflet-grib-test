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
import { ContextBaseLayers } from '../Context';
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
	providerVariant,
	providerOptions,
} ) => {
	const {
		layersForControl,
		setLayersForControl,
	} = useContext( ContextBaseLayers );
	const map = useMap();
	useEffect( () => {
		if ( ! layersForControl[providerVariant] ) {
			// Init layer, but do not add to map.
			const layer = L.tileLayer.provider( providerVariant, providerOptions );
			// Add new layer to layersForControl.
			const newLayersForControl = {
				...layersForControl,
				[providerVariant]: layer,
			}
			setLayersForControl( newLayersForControl );
		}
	}, [layersForControl] );

	useEffect( () => {
		if ( Object.keys( layersForControl ).length ) {
			// Set first layer active
			const isOneLayerOnMap = Object.keys( layersForControl ).reduce( ( acc, layerKey ) => acc ? acc : !! map.hasLayer( layersForControl[layerKey] ), false );
			if ( ! isOneLayerOnMap ) {
				layersForControl[Object.keys( layersForControl )[0]].addTo( map );
			}
		}
	}, [layersForControl] );

	return null;
};

const BaseLayersControl = () => {
	const map = useMap();
	const { layersForControl } = useContext( ContextBaseLayers );
	useEffect( () => {
		let layerControl;
		if ( Object.keys( layersForControl ).length ) {
			// Init control and add to map
			layerControl = L.control.layers( layersForControl );
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

const Map = () => {

	const [layersForControl,setLayersForControl] = useState( {} );

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

			<ContextBaseLayers.Provider value={ {
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

				<BaseLayersControl/>

			</ContextBaseLayers.Provider>

			<FullscreenControl position="topright" />

			<MapInvalidateSize style={ style } />

			<ZoomControl position="topright" />

		</MapContainer>
    </div>;
}

export default Map;