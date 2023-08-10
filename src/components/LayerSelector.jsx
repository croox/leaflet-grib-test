import {
	useEffect,
  	useState,
} from 'react';

const shallowEqual = ( object1, object2 ) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if ( keys1.length !== keys2.length ) {
        return false;
    }

    for ( let key of keys1 ) {
        if ( object1[key] !== object2[key] ) {
            return false;
        }
    }

    return true;
}

const LayerSelector = ( {
    plotGroups,
    days,
} ) => {

    const [selectedPlotGroup,setSelectedPlotGroup] = useState( false )
    const [selectedDay,setSelectedDay] = useState( false )

	useEffect( () => {
        if ( selectedPlotGroup && ! selectedPlotGroup.layers.find( l => l.day === selectedDay ) ) {
            setSelectedDay( selectedPlotGroup.layers[0].day );
        }
    }, [selectedPlotGroup] );

	// console.log( 'debug plotGroups', plotGroups ); // debug
	// console.log( 'debug days', days ); // debug

	return <div className="layer-selector">
        <div className="layer-selector-list">
            <ul>
                { [...plotGroups].map( ( plotGroup, pgidx ) => {
                    return <li
                        key={ pgidx }
                        onClick={ () => setSelectedPlotGroup( plotGroup ) }
                        className={ [
                            'btn',
                            shallowEqual( plotGroup, selectedPlotGroup ) && 'active',
                            pgidx > 0 && plotGroups[ pgidx - 1 ].Var_name !== plotGroup.Var_name && 'first',

                        ].join( ' ' ) }
                    >
                        { [
                            plotGroup.today,
                            plotGroup.model,
                            plotGroup.Var_name,
                            plotGroup.variable,
                            '-' !== plotGroup.Witch_DAY && plotGroup.Witch_DAY,
                            'nomask' !== plotGroup.mask_str && plotGroup.mask_str,
                        ].map( ( str, sidx ) => <span key={ sidx }>{ str }</span> ) }
                    </li>
                } ) }
            </ul>
        </div>

        <div className='layer-selector-detail'>
            { selectedPlotGroup && selectedPlotGroup['layers'] && <>
                <h3 className={ 'property' } >{ selectedPlotGroup.cbar_label }</h3>
                { [
                    'today',
                    'model',
                    'Var_name',
                    'variable',
                    'mask_str',
                    'Witch_DAY',
                ].map( ( key, kidx ) => {
                    return <div
                        key={ kidx }
                        className={ 'property' }
                    >
                        <span>{ key }:</span> <span>{ selectedPlotGroup[key] }</span>
                    </div>
                } ) }
                <div className={ 'property' }>
                    <span>days:</span> <span>
                        <ul>
                            { [...days].map( day => {
                                const disabled = ! selectedPlotGroup.layers.find( l => l.day === day );
                                return <li
                                    key={ day }
                                    className={ [
                                        'btn',
                                        selectedDay && selectedDay === day && 'active',
                                        disabled && 'disabled'
                                    ].join( ' ' ) }
                                    onClick={ () => ! disabled && setSelectedDay( day ) }
                                >
                                    { day }
                                </li>
                            } ) }
                        </ul>

                    </span>
                </div>
            </> }

        </div>
	</div>;
}

export default LayerSelector;
