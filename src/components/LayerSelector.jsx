import {
	useEffect,
  	useState,
} from 'react';
import { variationsMap } from '../constants';

const LayerSelector = ( {
    plotGroups,
    availableVariations,
} ) => {

    const [selectedVarName,setSelectedVarName] = useState( false )

    const [selectedVariation,setSelectedVariation] = useState( {
        witchDay: false,
        maskStr: false,
        model: false,
        date: false,
        day: false,
    } );

    const selectedPlotGroup = selectedVarName ? plotGroups.find( pg => pg.Var_name === selectedVarName ) : false;

	useEffect( () => {
        let newSelectedVariation = {...selectedVariation};
        [...variationsMap].map( ( {
            plotKey,
            variationkey,
        } ) => {
            if ( selectedPlotGroup && ! selectedPlotGroup.layers.find( l => l[plotKey] === selectedVariation[variationkey] ) ) {
                newSelectedVariation[variationkey] = selectedPlotGroup.layers[0][plotKey];
            }
        } );
        setSelectedVariation( newSelectedVariation );
    }, [selectedPlotGroup] );

	useEffect( () => {
        const selectedPlot = selectedPlotGroup ? selectedPlotGroup.layers.find( l => Object.keys( selectedVariation ).reduce( ( acc, variationkey ) => {
            if ( acc ) {
                return l[variationsMap.find( v => v.variationkey === variationkey).plotKey] === selectedVariation[variationkey] ? l : false;
            }
            return acc;
        }, true ) ) : false;
        console.log( 'debug selectedPlot', selectedPlot ); // debug
    }, [selectedPlotGroup, selectedVariation] );

    // console.log( 'debug selected', {
    //     Var_name: selectedVarName,
    //     ...selectedVariation,
    // } );

	return <div className="layer-selector">
        <div className="layer-selector-list">
            <ul>
                { [...plotGroups].map( ( plotGroup, pgidx ) => {
                    return <li
                        key={ pgidx }
                        onClick={ () => setSelectedVarName( plotGroup.Var_name ) }
                        className={ [
                            'btn',
                            plotGroup.Var_name === selectedVarName ? 'active' : '',
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
            { selectedPlotGroup && selectedPlotGroup.layers && <>

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

                { [...variationsMap].map( ( {
                    plotKey,
                    variationkey,
                } ) => {
                    return <div key={ variationkey } className={ 'property' }>
                        <span>{ plotKey }:</span> <span>
                            <ul>
                                { [...availableVariations[variationkey]].map( val => {
                                    const disabled = ! selectedPlotGroup.layers.find( l => l[plotKey] === val );
                                    return <li
                                        key={ val }
                                        className={ [
                                            'btn',
                                            selectedVariation[variationkey] && selectedVariation[variationkey] === val && 'active',
                                            disabled && 'disabled'
                                        ].join( ' ' ) }
                                        onClick={ () => ! disabled && setSelectedVariation( { ...selectedVariation, [variationkey]: val } ) }
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
