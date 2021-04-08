import React from 'react'
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import AutoCompleteTextField from './components/AutoCompleteTextField'

function Condition(props) {
    return (
        <Grid container justify="space-between" spacing={3} alignItems="center">
            <Grid item>
                <DeleteIcon
                    style={{cursor: "pointer"}}
                    onClick={(e) => {
                        e.preventDefault();
                        props.deleteCondition(props.condition.id)
                    }}
                />
            </Grid>
            <Grid item>
                <Select
                    value={props.condition.parametor} 
                    onChange={e => props.parametorChange(e, props.condition.id)}
                >
                    {
                        props.columns.map(column => (
                            <MenuItem key={column} value={column}>{column}</MenuItem>
                        ))
                    }
                </Select>
            </Grid>
            <Grid item>
                <Select
                    value={props.condition.comparator} 
                    onChange={e => props.comparatorChange(e, props.condition.id)}
                >
                    <MenuItem value=">">{'>'}</MenuItem>
                    <MenuItem value="<">{'<'}</MenuItem>
                    <MenuItem value=">=">{'>='}</MenuItem>
                    <MenuItem value="<=">{'<='}</MenuItem>
                    <MenuItem value="==">{'=='}</MenuItem>
                    <MenuItem value="!=">{'!='}</MenuItem>
                    <MenuItem value="Same Signs">{'Same Signs'}</MenuItem>
                </Select>
            </Grid>

            <Grid item>
                <AutoCompleteTextField 
                    columns={props.columns}
                    valueChange={props.valueChange}
                    conditionId={props.condition.id}
                    value={props.condition.value}
                />
            </Grid>

            <Grid item>
                <Select 
                    value={props.condition.abs} 
                    onChange={e => props.absChange(e, props.condition.id)}
                >
                    <MenuItem value="None">{'No Absolute Value'}</MenuItem>
                    <MenuItem value="Right">{'Absolute Value On Right Side'}</MenuItem>
                    <MenuItem value="Left">{'Absolute Value On Left Side'}</MenuItem>
                    <MenuItem value="Both">{'Absolute Value On Both Sides'}</MenuItem>
                </Select>
            </Grid>
            <br />
            <br />
        </Grid>
    )
}

export default Condition
