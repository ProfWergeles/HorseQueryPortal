import React from 'react'
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import AutoCompleteTextField from './components/AutoCompleteTextField'

function Condition(props) {
    return (
        <Grid container justify="space-between">
            <Grid item>
                <DeleteIcon
                    style={{cursor: "pointer"}}
                    onClick={(e) => {
                        e.preventDefault();
                        props.deleteCondition(props.condition.id)
                    }}
                />
            </Grid>
            <Grid>
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
                {/* <Select
                    value={props.condition.parametor} 
                    onChange={e => props.parametorChange(e, props.condition.id)}
                >
                    {
                        props.columns.map(column => (
                            <MenuItem key={column} value={column}>{column}</MenuItem>
                        ))
                    }
                </Select> */}
            </Grid>
            <Grid item>
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
            </Grid>

            <Grid item>
                <AutoCompleteTextField 
                    columns={props.columns}
                    valueChange={props.valueChange}
                    conditionId={props.condition.id}
                    value={props.condition.value}
                />
            </Grid>

            <Grid>
                <select 
                    value={props.condition.abs} 
                    onChange={e => props.absChange(e, props.condition.id)}
                >
                    <option value="None">{'No Absolute Value'}</option>
                    <option value="Right">{'Absolute Value On Right Side'}</option>
                    <option value="Left">{'Absolute Value On Left Side'}</option>
                    <option value="Both">{'Absolute Value On Both Sides'}</option>
                </select>
            </Grid>
            <br />
            <br />
        </Grid>
    )
}

export default Condition
