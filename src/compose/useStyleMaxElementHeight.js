
import {
	useState,
    useLayoutEffect,
} from 'react';

const height = 1200;

const useStyleMaxElementHeight = () => {
    const [windowHeight, setWindowHeight] = useState( 0 );
    useLayoutEffect(() => {
        const updateSize = () => {
            setWindowHeight(
                window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight
            );
        }
        window.addEventListener( 'resize', updateSize );
        updateSize();

        return () => window.removeEventListener( 'resize', updateSize );
    }, [] );
    return {
        height: windowHeight,
    };
};

export default useStyleMaxElementHeight;