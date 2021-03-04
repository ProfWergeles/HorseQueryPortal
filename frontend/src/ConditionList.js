import React from 'react'
import Condition from './Condition'

function ConditionList(props) {

    return (
        <div className="conditionList">
            {
                props.conditions.map(condition => (
                    <Condition
                        key={condition.id}
                        condition={condition}
                        parametorChange={props.parametorChange}
                        comparatorChange={props.comparatorChange}
                        valueChange={props.valueChange}
                        absChange={props.absChange}
                        deleteCondition={props.deleteCondition}
                        columns={props.columns}
                    />
                ))
            }
        </div>
    )
}

export default ConditionList
