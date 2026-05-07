import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemsEditPage({
  storybook = false,
}) {
  let { id } = useParams();

  const {
    data: ucsbDiningCommonsMenuItems,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/ucsbdiningcommonsmenuitems?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/ucsbdiningcommonsmenuitems`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (ucsbDiningCommonsMenuItems) => ({
    url: "/api/ucsbdiningcommonsmenuitems",
    method: "PUT",
    params: {
      id: ucsbDiningCommonsMenuItems.id,
    },
    data: {
      diningCommonsCode: ucsbDiningCommonsMenuItems.diningCommonsCode,
      name: ucsbDiningCommonsMenuItems.name,
      station: ucsbDiningCommonsMenuItems.station,
    },
  });

  const onSuccess = (ucsbDiningCommonsMenuItems) => {
    toast(
      `UCSBDiningCommonsMenuItem Updated - id: ${ucsbDiningCommonsMenuItems.id} name: ${ucsbDiningCommonsMenuItems.name}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsbdiningcommonsmenuitems?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/diningcommonsmenuitems" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSBDiningCommonsMenuItem</h1>
        {ucsbDiningCommonsMenuItems && (
          <UCSBDiningCommonsMenuItemForm
            initialContents={ucsbDiningCommonsMenuItems}
            submitAction={onSubmit}
            buttonLabel="Update"
          />
        )}
      </div>
    </BasicLayout>
  );
}
