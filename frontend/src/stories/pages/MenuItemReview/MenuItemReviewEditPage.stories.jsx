import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";
import { MenuItemReviewFixtures } from "fixtures/MenuItemReviewFixtures";

export default {
  title: "pages/MenuItemReview/MenuItemReviewEditPage",
  component: MenuItemReviewEditPage,
};

const Template = () => <MenuItemReviewEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/menuitemreview", () => {
      return HttpResponse.json(MenuItemReviewFixtures.threeMenuItemReviews[0], {
        status: 200,
      });
    }),

    http.put("/api/menuitemreview", () => {
      return HttpResponse.json(
        {
          id: 17,
          itemId: "16",
          reviewerEmail: "edit@ucsb.edu",
          stars: "4",
          dateReviewed: "2022-01-01T12:00",
          comments: "skibidiedit",
        },
        { status: 200 },
      );
    }),
  ],
};
