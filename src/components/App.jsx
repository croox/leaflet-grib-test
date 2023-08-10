import {
	// useRef,
	// useContext,
	useEffect,
  	useState,
} from 'react';

import '../style/App.scss';
import { variationsMap } from '../constants';
import Map from './Map';
import LayerSelector from './LayerSelector.jsx';

const App = () => {


	const [selectedPlot,setSelectedPlot] = useState( false );

	return <div className="App">

		<Map/>

		<div className="tile_url_path">
			{ selectedPlot ? selectedPlot.tile_url_path : '' }
		</div>

		<LayerSelector
			setSelectedPlot={ setSelectedPlot }
		/>

	</div>;
}

export default App;
