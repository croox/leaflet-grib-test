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

	const [plotGroups,setPlotGroups] = useState( [] );
	const [availableVariations,setAvailableVariations] = useState( false );

	const url = 'http://localhost:3000/tiles/availability.json';
	// const url = 'https://powderguide-tileserver.croox.com/tiles/availability.json';

	useEffect( () => {
		if ( ! plotGroups.length ) {
			fetch( url, {
  				// mode: "cors",
				// credentials: "include",
				// headers: {
				// 	"Authorization" : "Basic " + btoa( 'alice:secret' ),
				// 	'Content-Type': 'application/json',
				// }
			} ).then( res => res.text() ).then( plots => {
				const newPlotGroupsObj = {};
				let newVariations = {
					witchDay: [],
					maskStr: [],
					model: [],
					date: [],
					day: [],
				};
				[...JSON.parse( plots )].map( plot => {
					// console.log( 'debug plot', plot ); // debug
					if ( ! newPlotGroupsObj.hasOwnProperty( plot.Var_name ) ) {
						newPlotGroupsObj[plot.Var_name] = {
							// ...plot,
							Var_name: plot.Var_name,
							variable: plot.variable,
							cbar_label: plot.cbar_label,
							layers: [plot],
						};
					} else {
						newPlotGroupsObj[plot.Var_name] = {
							...newPlotGroupsObj[plot.Var_name],
							layers: [
								...newPlotGroupsObj[plot.Var_name].layers,
								plot,
							],
						}
					}
					[...variationsMap].map( ( {
						plotKey,
						variationkey,
					} ) => {
						if ( ! newVariations[variationkey].includes( plot[plotKey] ) ) {
							newVariations[variationkey] = [...newVariations[variationkey],plot[plotKey]];
						}
					} );
				} );
				setPlotGroups( Object.values( newPlotGroupsObj ) );
				setAvailableVariations( newVariations );
			} ).catch( err => {
				console.log( 'debug err', err ); // debug
			} );
		}
	}, [] );

	return <div className="App">

		<Map/>

		{ plotGroups.length > 0 && availableVariations && <LayerSelector
			plotGroups={ plotGroups }
			availableVariations={ availableVariations }
		/> }

	</div>;
}

export default App;
