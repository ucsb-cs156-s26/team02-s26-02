import React from "react";
import { _useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import _RestaurantTable from "main/components/Restaurants/RestaurantTable";
import { _useCurrentUser, _hasRole } from "main/utils/useCurrentUser";
import { _Button } from "react-bootstrap";

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
