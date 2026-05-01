const articlesFixtures = {
  oneArticle: {
    id: 1,
    title: "Article 1",
    url: "http://example.com/article1",
    explanation: "This is the first article.",
    email: "author1@example.com",
    dateAdded: "2026-4-30T12:00:00"
  },
  threeArticles: [
    {
      id: 1,
      title: "Article 1",
      url: "http://example.com/article1",
      explanation: "This article is about [topic].",
      email: "author1@example.com",
      dateAdded: "2026-4-30T12:00:00",
    },
    {
      id: 2,
      title: "Article 2",
      url: "http://example.com/article2",
      explanation: "This article discusses [topic].",
      email: "author2@example.com",
      dateAdded: "2026-4-30T12:00:00",
      localDateTime: "2026-04-03T12:00:00",
    },
    {
      id: 3,
      title: "Article 3",
      url: "http://example.com/article3",
      explanation: "This article explores [topic].",
      email: "author3@example.com",
      dateAdded: "2026-4-30T12:00:00",
    },
  ],
};

export { articlesFixtures };
