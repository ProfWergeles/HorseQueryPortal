const queries = new Map([
    ["Ipsilateral Impact", [
        {
            id: 0,
            parametor: "Trial",
            comparator: "==",
            value: "Straight Line",
            abs: "None",
        },
        {
            id: 1,
            parametor: "Blocks",
            comparator: "==",
            value: "Null",
            abs: "None",
        },
        {
            id: 2,
            parametor: "Fore Strides",
            comparator: ">=",
            value: "20",
            abs: "None",
        }
    ]],
    ["Ipsilateral Pushoff", [
        {
            id: 0,
            parametor: "Trial",
            comparator: "==",
            value: "Straight Line",
            abs: "None",
        },
        {
            id: 1,
            parametor: "Blocks",
            comparator: "==",
            value: "Null",
            abs: "None",
        },
        {
            id: 2,
            parametor: "Fore Strides",
            comparator: ">=",
            value: "10",
            abs: "None",
        }
    ]]
]);

export default queries;