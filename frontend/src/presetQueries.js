const queries = new Map([
    ["Ipsilateral Impact", [
        {
            id: 0,
            parametor: "Trial",
            comparator: "==",
            value: "Straight Line",
        },
        {
            id: 1,
            parametor: "Blocks",
            comparator: "==",
            value: "Null",
        },
        {
            id: 2,
            parametor: "Fore Strides",
            comparator: ">=",
            value: "20",
        }
    ]],
    ["Ipsilateral Pushoff", [
        {
            id: 0,
            parametor: "Trial",
            comparator: "==",
            value: "Straight Line",
        },
        {
            id: 1,
            parametor: "Blocks",
            comparator: "==",
            value: "Null",
        },
        {
            id: 2,
            parametor: "Fore Strides",
            comparator: ">=",
            value: "10",
        }
    ]]
]);

export default queries;