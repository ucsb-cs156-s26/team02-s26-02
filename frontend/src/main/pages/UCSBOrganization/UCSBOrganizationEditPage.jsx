import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({ storybook = false }) {
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Page not yet implemented</h1>
      </div>
    </BasicLayout>
  );
}
