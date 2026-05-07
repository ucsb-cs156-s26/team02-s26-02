const ucsbOrganizationFixtures = {
  oneUCSBOrganization: {
    orgCode: "MHJ",
    orgTranslationShort: "Mahjong Club",
    orgTranslation: "Asian Board Games Club",
    inactive: false,
  },
  threeUCSBOrganizations: [
    {
      orgCode: "MHJ",
      orgTranslationShort: "Mahjong Club",
      orgTranslation: "Asian Board Games Club",
      inactive: false,
    },
    {
      orgCode: "CHS",
      orgTranslationShort: "Chess Club",
      orgTranslation: "Board Games Club",
      inactive: false,
    },
    {
      orgCode: "MAG",
      orgTranslationShort: "Magic Club",
      orgTranslation: "Card Games Club",
      inactive: true,
    },
  ],
};

export { ucsbOrganizationFixtures };
