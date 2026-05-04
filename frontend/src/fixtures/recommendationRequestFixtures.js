const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: "requesterEmail@email.com",
    professorEmail: "professorEmail@email.com",
    explanation: "An explanation",
    dateRequested: "YYYY-MM-DDTHH:MM:SS",
    dateNeeded: "YYYY-MM-DDTHH:MM:SS",
    done: false,
  },
  threeRecommendationRequests: [
    {
      id: 1,
      requesterEmail: "requesterEmail@email.com",
      professorEmail: "professorEmail@email.com",
      explanation: "An explanation",
      dateRequested: "2022-01-02T12:00:00",
      dateNeeded: "YYYY-MM-DDTHH:MM:SS",
      done: false,
    },
    {
      id: 2,
      requesterEmail: "requesterEmail@email.com",
      professorEmail: "professorEmail@email.com",
      explanation: "An explanation",
      dateRequested: "2022-01-02T12:00:00",
      dateNeeded: "YYYY-MM-DDTHH:MM:SS",
      done: false,
    },
    {
      id: 3,
      requesterEmail: "requesterEmail@email.com",
      professorEmail: "professorEmail@email.com",
      explanation: "An explanation",
      dateRequested: "2022-01-02T12:00:00",
      dateNeeded: "YYYY-MM-DDTHH:MM:SS",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
