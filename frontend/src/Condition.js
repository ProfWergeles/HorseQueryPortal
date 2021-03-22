import React from 'react'

function Condition(props) {
    return (
        <div className="conditions">
            <button 
                style={{cursor: "pointer"}}
                onClick={(e) => {
                    e.preventDefault();
                    props.deleteCondition(props.condition.id)
                }}
            >
                DELETE
            </button>
            <select 
                value={props.condition.parametor} 
                onChange={e => props.parametorChange(e, props.condition.id)}
            >
                {
                    props.columns.map(column => (
                        <option key={column} value={column}>{column}</option>
                    ))
                }
            </select>
            <select 
                value={props.condition.comparator} 
                onChange={e => props.comparatorChange(e, props.condition.id)}
            >
                <option value=">">{'>'}</option>
                <option value="<">{'<'}</option>
                <option value=">=">{'>='}</option>
                <option value="<=">{'<='}</option>
                <option value="==">{'=='}</option>
                <option value="!=">{'!='}</option>
                <option value="Same Signs">{'Same Signs'}</option>
            </select>
            <input type="text" 
                value={props.condition.value} 
                onChange={e => props.valueChange(e, props.condition.id)}
            />
            <select 
                value={props.condition.abs} 
                onChange={e => props.absChange(e, props.condition.id)}
            >
                <option value="None">{'No Absolute Value'}</option>
                <option value="Right">{'Absolute Value On Right Side'}</option>
                <option value="Left">{'Absolute Value On Left Side'}</option>
                <option value="Both">{'Absolute Value On Both Sides'}</option>
            </select>
            <br />
            <br />
        </div>
    )
}

export default Condition
