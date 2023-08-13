import {
	// useRef,
	// useContext,
	// useEffect,
  	useState,
} from 'react';

import '../style/App.scss';
import Map from './Map';
import LayerSelector, { tileServerUrl } from './LayerSelector.jsx';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const App = () => {


	const [selectedPlot,setSelectedPlot] = useState( false );
	const [opacity,setOpacity] = useState( 0.5 );

	return <div className="App">

		<Map
			selectedPlot={ selectedPlot }
			opacity={ opacity }
		/>

		<div className="tile_url_path">
			{ selectedPlot ? tileServerUrl + selectedPlot.tile_url_path : '' }
		</div>

		<div className="opacity-control">
			<span>opacity: </span>
			<Slider
				disabled={ ! selectedPlot }
				value={ opacity }
				min={ 0 }
				max={ 1 }
				step={ 0.05 }
				onChange={ setOpacity }
			/>
		</div>

		<LayerSelector
			setSelectedPlot={ setSelectedPlot }
		/>

	</div>;
}

export default App;
