import React from "react";
import UCSBDiningCommonsMenuItemsTable from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title:
    "components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable",
  component: UCSBDiningCommonsMenuItemsTable,
};

const Template = (args) => {
  return <UCSBDiningCommonsMenuItemsTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  diningCommonsMenuItems: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  diningCommonsMenuItems:
    ucsbDiningCommonsMenuItemsFixtures.threeDiningCommonsMenuItems,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  diningCommonsMenuItems:
    ucsbDiningCommonsMenuItemsFixtures.threeDiningCommonsMenuItems,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsbdiningcommonsmenuitems", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
