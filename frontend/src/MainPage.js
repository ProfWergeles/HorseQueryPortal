import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useHistory } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import ConditionList from './ConditionList';
import queries from './presetQueries';

function MainPage() {
    let history = useHistory();

    const [step, setStep] = useState(1);

    const [currentForm, setCurrentForm] = useState(0);
    const [query, setQuery] = useState("");

    const [file, setFile] = useState(null);
    const [columns ,setColumns] = useState([]);
    const [browseFilename, setBrowseFilename] = useState("Browse Files...");
    const [conditions, setConditions] = useState([]);
    const [error, setError] = useState("");


    useEffect(() => {
        // initialize conditions
        if (columns.length !== 0 && conditions.length === 0) {
            setConditions([{
                id: 0,
                parameter: columns[0],
                comparator: ">",
                value: "",
            }]);
        }

        if (query !== "") {
            queries.get(query).forEach(condition => {
                setConditions([{
                    id: condition.id,
                    parameter: condition.parameter,
                    comparator: condition.comparator,
                    value: condition.value,
                }])
            });
        }
    }, [columns, conditions, query]);

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

        // if it is two query form
        if (currentForm === 0) {
            formData.append("query", query);

        } else {
            conditions.forEach(condition => {
                if (condition.value === "") {
                    validForm = false;
                }
                formData.append(`parametor${condition.id}`, condition.parameter);
                formData.append(`comparator${condition.id}`, condition.comparator);
                formData.append(`value${condition.id}`, condition.value);
            })
    
            if (!validForm) {
                setError("Please fill out every field")
                return;
            }
        }

        axios.post('/api/upload-file', formData)
        .then(res => {
            if (res.data.success === true) {
                console.log(res.data.file);
                history.push({
                    pathname: '/download',
                    state: res.data.file,
                })
            } else {
                // need to deal with the error in frontend and backend
            }
        });
    }


    const parametorChange = (e, id) => {
        let c = [...conditions];

        for (var i in c) {
            if (c[i].id === id) {
                c[i].parameter = e.target.value;
            }
        }

        setConditions(c);
    }

    const comparatorChange = (e, id) => {
        let c = [...conditions];

        for (var i in c) {
            if (c[i].id === id) {
                c[i].comparator = e.target.value;
            }
        }

        setConditions(c);
    }

    const valueChange = (e, id) => {
        let c = [...conditions];

        for (var i in c) {
            if (c[i].id === id) {
                c[i].value = e.target.value;
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

    const nextStep = (number) => {
        setStep(step + number);
    }

    const prevStep = (number) => {
        setStep(step - number);
    }

    // switch between steps
    const switchSteps = (step) => {
        switch(step) {
            case 1:
                return (
                    <div>
                        <p>Do you want to use preset query?</p>
                        <br />
                        <div onClick={() => nextStep(1)}>Yes</div>
                        <br />
                        <br />
                        <div onClick={() => nextStep(2)}>No</div>
                    </div>
                )
            case 2: 
                return (
                    <div>
                        <select
                            onChange={e => setQuery(e.target.value)}
                        >
                            <option value="">Please select a query</option>
                            <option value="Ipsilateral Impact">Ipsilateral Impact</option>
                            <option value="Ipsilateral Pushoff">Ipsilateral Pushoff</option>
                            <option value="Ipsilateral Mostly Impact">Ipsilateral Mostly Impact</option>
                            <option value="Just Impact">Just Impact</option>
                            <option value="Just Pushoff">Just Pushoff</option>
                            <option value="pdn">PDN Query</option>
                        </select>
                        <br />
                        <br />
                        <div onClick={() => {
                            if (query === "") {
                                alert("Please select a query")
                            } else {
                                nextStep(1);
                            }
                        }}>Next</div>
                    </div>
                )
            case 3: 
                return (
                    <div>
                        <ConditionList 
                            conditions={conditions}
                            parametorChange={parametorChange}
                            comparatorChange={comparatorChange}
                            valueChange={valueChange}
                            deleteCondition={deleteCondition}
                            columns={columns}
                        />
                        <button
                            className="klButton"
                            onClick={(e) => {
                                e.preventDefault();
                                addCondition({
                                    id: conditions[conditions.length-1].id + 1 ,
                                    parameter: columns[0],
                                    comparator: ">",
                                    value: "",
                                })
                            }}
                        >
                            ADD
                        </button>
                        <button className="mainPage__browseFileButton" type="submit">{"Upload & Go"}</button>
                    </div>
                )
            default:
                console.log("step error")
        }
    }

    return (
        <div className="mainPage">
            <div className="wrapper">
                <Tabs onSelect={(currentIndex) => setCurrentForm(currentIndex)}>
                    <TabList>
                    <Tab>Preset Query</Tab>
                    <Tab>Dynamic Query</Tab>
                    </TabList>

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
                                    setBrowseFilename("Browse Files...");
                                    setFile(null);
                                    setColumns([]);
                                    setConditions([{
                                        id: 0,
                                        parameter: "",
                                        comparator: "",
                                        value: "",
                                    }]);
                                    return;
                                }

                                setFile(e.target.files[0]);
                                setBrowseFilename(e.target.files[0].name);
                                parseColumns(e.target.files[0]);
                            }}
                        />
                        
                        <br />
                        <br />
                        <div style={{color: "red"}}>{error}</div>
                        <br />
                        <br />

                        <TabPanel>
                            {/* <div>
                                <select
                                    onChange={e => setQuery(e.target.value)}
                                >
                                    <option value="Ipsilateral Impact">Ipsilateral Impact</option>
                                    <option value="Ipsilateral Pushoff">Ipsilateral Pushoff</option>
                                    <option value="Ipsilateral Mostly Impact">Ipsilateral Mostly Impact</option>
                                    <option value="Just Impact">Just Impact</option>
                                    <option value="Just Pushoff">Just Pushoff</option>
                                    <option value="pdn">PDN Query</option>
                                </select>
                            </div> */}
                        </TabPanel>
                        <TabPanel>
                            {(columns.length === 0 ? (<div></div>) : 
                                switchSteps(step)
                            )}
                        </TabPanel>

                        <br />
                        <br />
                    </form>
                </Tabs>
                <br />
                <br />
            </div>
        </div>
    )
}

export default MainPage
