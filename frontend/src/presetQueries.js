const queries = new Map([
    ["Ipsilateral Impact", [
        {
            id: 0,
            parameter: "Trial",
            comparator: "==",
            value: "Straight Line",
        },
        {
            id: 1,
            parameter: "Blocks",
            comparator: "==",
            value: "Null",
        }
    ]],
    ["Ipsilateral Pushoff", ["Fore Strides", ">=", "20"]]
]);

export default queries;