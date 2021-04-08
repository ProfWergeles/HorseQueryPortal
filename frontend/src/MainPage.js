import React, { useState } from 'react';

import axios from 'axios';
import { useHistory } from "react-router-dom";
import 'react-tabs/style/react-tabs.css';
import Grid from '@material-ui/core/Grid';

import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import ConditionList from './ConditionList';
import queries from './presetQueries';

function MainPage() {
    let history = useHistory();

    const [step, setStep] = useState(1);
    const [query, setQuery] = useState("");

    const [file, setFile] = useState(null);
    const [columns ,setColumns] = useState([]);
    const [browseFilename, setBrowseFilename] = useState("Browse Files...");
    const [conditions, setConditions] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();

        let formData = new FormData();
        var validForm = true;

        if (file == null) {
            setError("Please select a file")
            return;
        }

        let filename = "";
        let filetype = "";
        filename = file.name.split(".");
        filetype = filename.pop();
        filename = filename.join(".") + "_" + Date.now() + "." + filetype;

        formData.append("myfile", file, filename);

        if (query === "pdn" || query === "Only PDN") {
            formData.append("query", query);
        } else {
            formData.append("columns", columns)
            conditions.forEach(condition => {
                if (condition.value === "") {
                    validForm = false;
                }
                formData.append(`parametor${condition.id}`, condition.parametor);
                formData.append(`comparator${condition.id}`, condition.comparator);
                formData.append(`value${condition.id}`, condition.value);
                formData.append(`abs${condition.id}`, condition.abs);
            })
    
            if (!validForm) {
                setError("Please fill out every field");
                return;
            }
    
            console.log(conditions);
        }

        setLoading(true);

        axios.post('/api/upload-file', formData)
        .then(res => {
            if (res.data.success === true) {
                setLoading(false);
                console.log(res.data.file);
                history.push({
                    pathname: '/download',
                    state: res.data.file,
                })
            } else {
                // need to deal with the error in frontend and backend
                setLoading(false);
                alert("Server error")
            }
        });
    }

    const parametorChange = (e, id) => {
        let c = [...conditions];

        for (var i in c) {
            if (c[i].id === id) {
                c[i].parametor = e.target.value;
            }
        }

        setConditions(c);
    }

    const comparatorChange = (e, id) => {
        let c = [...conditions];

        for (let i in c) {
            if (c[i].id === id) {
                c[i].comparator = e.target.value;
            }
        }

        setConditions(c);
    }

    const absChange = (e, id) => {
        let c = [...conditions];

        for (let i in c) {
            if (c[i].id === id) {
                c[i].abs = e.target.value;
            }
        }

        setConditions(c);
    }

    const valueChange = (newValue, id) => {
        let c = [...conditions];

        for (var i in c) {
            if (c[i].id === id) {
                c[i].value = newValue;
            }
        }

        setConditions(c);
    }

    const addCondition = condition => {
        setConditions([...conditions, condition]);
        console.log(`added condition: ${condition.id}`)
    }

    const deleteCondition = id => {
        if (conditions.length === 1) return;

        let c = [];
        conditions.forEach(condition => {
            if (condition.id !== id) {
                c.push(condition);
            }
        });

        setConditions(c);
        console.log(`deleted condition: ${id}`)
    }

    const parseColumns = file => {
        var filename = file.name;
        var tmp = filename.split(".");
        var filetype = tmp.pop();

        if (filetype !== "csv") {
            window.alert("Please select a csv file");
            setFile(null);
            setBrowseFilename("Browse Files...");
            return;
        }

        const reader = new FileReader();
        reader.onload = e => {
            // convert csv data to string
            const data = e.target.result;

            // get header by getting srting before new line and then split the string by comma
            const headers = data.substr(0, data.indexOf("\n")).split(",");

            // sort the headers alphabatically for easier look up
            headers.sort();
            setColumns(headers);
        }

        reader.readAsText(file);
    }

    const populateConditions = () => {
        if (query === "pdn" || query === "Only PDN") {
            return;
        }
        if (query !== "") {
            let tmpConditions = [];
            queries.get(query).forEach(condition => {
                // if query includes non-existing column, then skip it.
                if (!columns.includes(condition.parametor)) {
                    console.log(condition.parametor)
                    return;
                }

                tmpConditions.push(condition);
            });

            setConditions(tmpConditions)
        }
    }

    const reset = () => {
        setStep(1);
        setQuery("");
        setFile(null);
        setColumns([]);
        setBrowseFilename("Browse Files...");
        setConditions([]);
        setError("")
    }

    const nextStep = (number) => {
        setError("")
        setStep(step + number);
    }

    const prevStep = (number) => {
        setError("")
        setStep(step - number);
    }

    // switch between steps
    const switchSteps = (step) => {
        switch(step) {
            case 1:
                return (
                    <div>
                        <p className="header">Do you want to use preset query?</p>
                        <div className="klButton" onClick={() => {
                            nextStep(2)
                            setConditions([{
                                id: 0,
                                parametor: columns[0],
                                comparator: ">",
                                value: "",
                                abs: "None",
                            }]);
                        }}>No</div>
                        <br />
                        <div className="klButton" onClick={() => nextStep(1)}>Yes</div>
                    </div>
                )
            case 2: 
                return (
                    <div>
                        <Select
                            displayEmpty
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        >
                            <MenuItem value="" disabled>Please select a query</MenuItem>
                            <MenuItem value="Ipsilateral Impact">Ipsilateral Impact</MenuItem>
                            <MenuItem value="Ipsilateral Pushoff">Ipsilateral Pushoff</MenuItem>
                            <MenuItem value="Ipsilateral Mostly Impact">Ipsilateral Mostly Impact</MenuItem>
                            <MenuItem value="Ipsilateral Mostly Pushoff">Ipsilateral Mostly Pushoff</MenuItem>
                            <MenuItem value="Just Impact">Just Impact</MenuItem>
                            <MenuItem value="Just Pushoff">Just Pushoff</MenuItem>
                            <MenuItem value="Mostly Impact">Mostly Impact</MenuItem>
                            <MenuItem value="Mostly Pushoff">Mostly Pushoff</MenuItem>
                            <MenuItem value="pdn">PDN Query</MenuItem>
                            <MenuItem value="Only PDN">Only PDN</MenuItem>
                        </Select>
                        <br />
                        <br />
                        <div className="klButton" onClick={() => {
                            prevStep(1)
                        }}>Back</div>
                        <br />
                        <div className="klButton" onClick={() => {
                            if (query === "") {
                                alert("Please select a query")
                            } else {
                                populateConditions();
                                nextStep(1);
                            }
                        }}>Next</div>
                    </div>
                )
            case 3: 
                return (
                    <div>
                        <div style={{color: "red"}}>{error}</div>
                        <br />
                        <br />
                        <Grid container justify="center" spacing={5}>
                            <Grid item>
                                <div className="klButton" onClick={() => {
                                    prevStep(1);
                                }}>Back</div>
                            </Grid>
                            <Grid item>
                                <div className="klButton" onClick={() => {
                                    setStep(1);
                                }}>Start Over</div>
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        {query === "pdn" || query === "Only PDN" ? (<div>You chose {query} query</div>) : (<div className="conditionlist_wrapper">
                            <ConditionList 
                                conditions={conditions}
                                parametorChange={parametorChange}
                                comparatorChange={comparatorChange}
                                valueChange={valueChange}
                                absChange={absChange}
                                deleteCondition={deleteCondition}
                                columns={columns}
                            />
                            <br />
                            <button
                                className="klButton"
                                onClick={(e) => {
                                    e.preventDefault();
                                    addCondition({
                                        id: conditions[conditions.length-1].id + 1 ,
                                        parametor: columns[0],
                                        comparator: ">",
                                        value: "",
                                        abs: "None",
                                    })
                                }}
                            >
                                ADD
                            </button>
                        </div>)}
                        <button className="mainPage__browseFileButton" type="submit">{"Upload & Go"}</button>
                        {/*  */}
                        {loading ? <CircularProgress /> : <div></div>}
                    </div>
                )
            default:
                console.log("step error")
        }
    }

    return (
        <div className="mainPage">
            <div className="wrapper">
                <br />
                <h3 className="header">Upload a CSV file</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mainPage__browseFile">
                        <label htmlFor="file" className="mainPage__browseFileButton">{browseFilename}</label>
                    </div>
                    <input
                        id="file" 
                        type="file" 
                        onChange={e => {
                            setError("");
                            if (e.target.files[0] === undefined) {
                                reset();
                                return;
                            }

                            setFile(e.target.files[0]);
                            setBrowseFilename(e.target.files[0].name);
                            parseColumns(e.target.files[0]);
                        }}
                    />
                    <br />
                    <br />
                    {(columns.length === 0 ? (<div></div>) : 
                        switchSteps(step)
                    )}
                    <br />
                    <br />
                </form>
                <br />
                <br />
            </div>
        </div>
    )
}

export default MainPage
