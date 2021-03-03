const queries = new Map([
    ["Ipsilateral Impact", [
        {
            id: 0,
            parametor: "Trial",
            comparator: "==",
            value: "Straight Line",
            abs: "no abs",
        },
        {
            id: 1,
            parametor: "Blocks",
            comparator: "==",
            value: "Null",
            abs: "no abs",
        },
        {
            id: 2,
            parametor: "Fore Strides",
            comparator: ">=",
            value: "20",
            abs: "no abs",
        }
    ]],
    ["Ipsilateral Pushoff", [
        {
            id: 0,
            parametor: "Trial",
            comparator: "==",
            value: "Straight Line",
            abs: "no abs",
        },
        {
            id: 1,
            parametor: "Blocks",
            comparator: "==",
            value: "Null",
            abs: "no abs",
        },
        {
            id: 2,
            parametor: "Fore Strides",
            comparator: ">=",
            value: "10",
            abs: "no abs",
        }
    ]]
]);

export default queries;