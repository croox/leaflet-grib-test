import {
	// useRef,
	// useContext,
	useEffect,
  	useState,
} from 'react';

import '../style/App.scss';
import Map from './Map';
import LayerSelector from './LayerSelector.jsx';

const App = () => {

	const [plotGroups,setPlotGroups] = useState( [] );
	const [days,setDays] = useState( [] );

	const url = './availability.json';

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

				console.log( 'debug plots', JSON.parse( plots ) ); // debug


				const newPlotGroupsObj = {};
				let newDays = [];
				[...JSON.parse( plots )].map( plot => {
					const groupKey = [
						plot.today,
						plot.model,
						plot.variable,
						plot.Var_name,
						plot.mask_str,
						plot.Witch_DAY,
					].join( '####' );
					if ( ! newPlotGroupsObj.hasOwnProperty( groupKey ) ) {
						newPlotGroupsObj[groupKey] = {
							// model: plot.model,
							// today: plot.today,
							// variable: plot.variable,
							// Var_name: plot.Var_name,
							// mask_str: plot.mask_str,
							// Witch_DAY: plot.Witch_DAY,
							...plot,
							layers: [plot],
						};
					} else {
						newPlotGroupsObj[groupKey] = {
							...newPlotGroupsObj[groupKey],
							layers: [
								...newPlotGroupsObj[groupKey].layers,
								plot,
							],
						}
					}

					if ( ! newDays.includes( plot.day ) ) {
						newDays = [...newDays,plot.day];
					}
				} );
				setPlotGroups( Object.values( newPlotGroupsObj ) );
				setDays( newDays );
			} ).catch( err => {
				console.log( 'debug err', err ); // debug
			} );
		}
	}, [] );


	return <div className="App">

		<Map/>

		<LayerSelector
			plotGroups={ plotGroups }
			days={ days }
		/>

	</div>;
}

export default App;
