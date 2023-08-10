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

	const [witchDays,setWitchDays] = useState( [] );
	const [maskStrs,setMaskStrs] = useState( [] );
	const [models,setModels] = useState( [] );
	const [dates,setDates] = useState( [] );



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

				// console.log( 'debug plots', JSON.parse( plots ) ); // debug

				const newPlotGroupsObj = {};
				let newDays = [];
				let newWitchDays = [];
				let newMaskStrs = [];
				let newModels = [];
				let newDates = [];

				[...JSON.parse( plots )].map( plot => {
					const groupKey = [
						// plot.today,
						// plot.model,
						// plot.variable,
						plot.Var_name,
						// plot.cbar_label,
					].join( '####' );
					if ( ! newPlotGroupsObj.hasOwnProperty( groupKey ) ) {
						newPlotGroupsObj[groupKey] = {
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
					if ( ! newWitchDays.includes( plot.Witch_DAY ) ) {
						newWitchDays = [...newWitchDays,plot.Witch_DAY];
					}
					if ( ! newMaskStrs.includes( plot.mask_str ) ) {
						newMaskStrs = [...newMaskStrs,plot.mask_str];
					}
					if ( ! newModels.includes( plot.model ) ) {
						newModels = [...newModels,plot.model];
					}
					if ( ! newDates.includes( plot.today ) ) {
						newDates = [...newDates,plot.today];
					}

				} );
				setPlotGroups( Object.values( newPlotGroupsObj ) );
				setDays( newDays );
				setWitchDays( newWitchDays );
				setMaskStrs( newMaskStrs );
				setModels( newModels );
				setDates( newDates );
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
			witchDays={ witchDays }
			maskStrs={ maskStrs }
			models={ models }
			dates={ dates }
		/>

	</div>;
}

export default App;
