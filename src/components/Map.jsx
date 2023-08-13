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
import { tileServerUrl } from './LayerSelector.jsx';


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

const PlotLayer = ( {
	opacity,
	selectedPlot,
} ) => {
	const map = useMap();
	useEffect( () => {
		let layer;
		if ( selectedPlot ) {
			layer = L.tileLayer( tileServerUrl + selectedPlot.tile_url_path, {
				opacity: opacity,
				maxZoom: 9999,
				zIndex: 9999,
				maxNativeZoom: 8,
			} );
			layer.addTo( map )
		}
		return () => {
			if ( layer ) {
				map.removeControl( layer );
			}
		};
	}, [selectedPlot,opacity] );
	return null;
};

const Map = ( {
	selectedPlot,
	opacity,
} ) => {

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

				<LayersControl/>

				<PlotLayer
					opacity={ opacity }
					selectedPlot={ selectedPlot }
				/>

			</ContextLayers.Provider>

			<FullscreenControl position="topright" />

			<MapInvalidateSize style={ style } />

			<ZoomControl position="topright" />

		</MapContainer>
    </div>;
}

export default Map;