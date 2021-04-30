import React, { useState } from 'react'
import uuid from 'react-uuid'

import './AutoCompleteTextField.css';

function AutoCompleteTextField(props) {
  const [suggestions, setSuggestions] = useState(props.columns);

    const onTextChange = (e, id) => {
        let value = e.target.value;

        // sanitize out special character (only allow: dot(.), letters and numbers (\w), and space(\s))
        value = value.replace(/[^.\w\s-]/gi, '');

        let s = props.columns
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            s = props.columns.sort().filter(v => regex.test(v));
        }
        setSuggestions(s)
        props.valueChange(value, id);
    }

    const suggestSelected = (value, id) => {
        props.valueChange(value, id);
        setSuggestions([])
    }

    const renderSuggestions = (id) => {
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul>
                {suggestions.map(column => (<li key={uuid()} onMouseDown={() => suggestSelected(column, id)}>{column}</li>))}
            </ul>
        )
    }

  return (
    <div className="AutoCompleteTextField">
        <input type="text"
            value={props.value} 
            onChange={e => onTextChange(e, props.conditionId)}
        />
        {renderSuggestions(props.conditionId)}
    </div>
  )
}

export default AutoCompleteTextField
