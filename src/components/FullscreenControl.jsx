/**
 * External dependencies
 */
import L from 'leaflet';
import 'leaflet.fullscreen';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const FullscreenControl = props => {
    const map = useMap();

    useEffect(() => {
        // create control
        const control = L.control.fullscreen( props );
        // link control to map
        control.addTo( map );

        return () => {
            // get leaflet-control-zoom-fullscreen elements that need to be removed from container
            const elementsToRemove = control.getContainer().getElementsByClassName('leaflet-control-zoom-fullscreen') ?? [];
            for (const element of elementsToRemove) {
                // remove them
                element.remove();
            }
        };
    }, [] );

    return null;
};

export default FullscreenControl;