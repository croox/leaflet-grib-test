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
    witchDays,
    maskStrs,
    models,
    dates,
} ) => {

    const [selectedPlotGroup,setSelectedPlotGroup] = useState( false )

    const [selectedDate,setSelectedDate] = useState( false )
    const [selectedModel,setSelectedModel] = useState( false )
    const [selectedDay,setSelectedDay] = useState( false )
    const [selectedMaskStr,setSelectedMaskStr] = useState( false )
    const [selectedwitchDay,setSelectedwitchDay] = useState( false )

    const variations = [
        {
            label: 'today',
            vars: dates,
            selectedVar: selectedDate,
            lSelector: 'today',
            callback: setSelectedDate,
        },
        {
            label: 'model',
            vars: models,
            selectedVar: selectedModel,
            lSelector: 'model',
            callback: setSelectedModel,
        },
        {
            label: 'days',
            vars: days,
            selectedVar: selectedDay,
            lSelector: 'day',
            callback: setSelectedDay,
        },
        {
            label: 'mask_str',
            vars: maskStrs,
            selectedVar: selectedMaskStr,
            lSelector: 'mask_str',
            callback: setSelectedMaskStr,
        },
        {
            label: 'witchDay',
            vars: witchDays,
            selectedVar: selectedwitchDay,
            lSelector: 'Witch_DAY',
            callback: setSelectedwitchDay,
        },
    ];

	useEffect( () => {
        [...variations].map( ( {
            selectedVar,
            lSelector,
            callback,
        } ) => {
            if ( selectedPlotGroup && ! selectedPlotGroup.layers.find( l => l[lSelector] === selectedVar ) ) {
                callback( selectedPlotGroup.layers[0][lSelector] );
            }
        } );
    }, [selectedPlotGroup] );

	// console.log( 'debug plotGroups', plotGroups ); // debug
	// console.log( 'debug days', days ); // debug
	// console.log( 'debug witchDays', witchDays ); // debug
	// console.log( 'debug maskStrs', maskStrs ); // debug
	// console.log( 'debug models', models ); // debug
	// console.log( 'debug dates', dates ); // debug

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

                        ].join( ' ' ) }
                    >
                        { [
                            plotGroup.cbar_label,
                        ].map( ( str, sidx ) => <span key={ sidx }>{ str }</span> ) }
                    </li>
                } ) }
            </ul>
        </div>

        <div className='layer-selector-detail'>
            { selectedPlotGroup && selectedPlotGroup['layers'] && <>

                <h3 className={ 'property' } >{ selectedPlotGroup.cbar_label }</h3>

                { [
                    'Var_name',
                    'variable',
                ].map( ( key, kidx ) => {
                    return <div
                        key={ kidx }
                        className={ [
                            'property',
                            kidx === 1 ? 'last' : '',
                        ].join( ' ' ) }
                    >
                        <span>{ key }:</span> <span>{ selectedPlotGroup[key] }</span>
                    </div>
                } ) }

                { [...variations].map( ( {
                    label,
                    vars,
                    selectedVar,
                    lSelector,
                    callback,
                } ) => {
                    return <div className={ 'property' }>
                        <span>{ label }:</span> <span>
                            <ul>
                                { [...vars].map( val => {
                                    const disabled = ! selectedPlotGroup.layers.find( l => l[lSelector] === val );
                                    return <li
                                        key={ val }
                                        className={ [
                                            'btn',
                                            selectedVar && selectedVar === val && 'active',
                                            disabled && 'disabled'
                                        ].join( ' ' ) }
                                        onClick={ () => ! disabled && callback( val ) }
                                    >
                                        { val }
                                    </li>
                                } ) }
                            </ul>
                        </span>
                    </div>;
                } ) }
            </> }

        </div>
	</div>;
}

export default LayerSelector;
