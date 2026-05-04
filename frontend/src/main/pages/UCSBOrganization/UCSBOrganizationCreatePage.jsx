import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationCreatePage({ storybook = false }) {
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create Page not yet implemented</h1>
      </div>
    </BasicLayout>
  );
}
