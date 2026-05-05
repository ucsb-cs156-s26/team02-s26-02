import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantTable from "main/components/Restaurants/RestaurantTable";
import { useCurrentUser, hasRole } from "main/utils/useCurrentUser";
import { Button } from "react-bootstrap";

export default function UCSBOrganizationIndexPage() {
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Index Page not yet implemented</h1>
        <p>
          <a href="/ucsborganization/create">Create</a>
        </p>
        <p>
          <a href="/ucsborganization/edit/1">Edit</a>
        </p>
      </div>
    </BasicLayout>
  );
}
