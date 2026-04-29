const helpRequestFixtures = {
    oneRequest: {
        id: 1,
        requesterEmail: "dchen451@ucsb.edu",
        teamID: "01",
        tableOrBreakoutRoom: "Table 1",
        requestTime: "2022-01-02T12:00:00",
        explanation: "I don't understand how to do the homework",
        solved: false,
    },

    threeRequests: [
        {
            id: 1,
            requesterEmail: "dchen451@ucsb.edu",
            teamID: "01",
            tableOrBreakoutRoom: "Table 1",
            requestTime: "2022-01-02T12:00:00",
            explanation: "I don't understand how to do the homework",
            solved: false,
        },
        {
            id: 2,
            requesterEmail: "davidchen@ucsb.edu",
            teamID: "02",
            tableOrBreakoutRoom: "Table 2",
            requestTime: "2026-04-28T12:30:30",
            explanation: "I need help with the project",
            solved: true,
        },
        {
            id: 3,
            requesterEmail: "johndoe@ucsb.edu",
            teamID: "10",
            tableOrBreakoutRoom: "Table 10",
            requestTime: "2024-11-28T12:56:30",
            explanation: "I need help with the midterm",
            solved: false,
        }
    ],
};

export { helpRequestFixtures };