import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: MenuItemReview,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/menuitemreview?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/menuitemreview`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (MenuItemReview) => ({
    url: "/api/menuitemreview",
    method: "PUT",
    params: {
      id: MenuItemReview.id,
    },
    data: {
      itemId: MenuItemReview.itemId,
      reviewerEmail: MenuItemReview.reviewerEmail,
      stars: MenuItemReview.stars,
      dateReviewed: MenuItemReview.dateReviewed,
      comments: MenuItemReview.comments,
    },
  });

  const onSuccess = (MenuItemReview) => {
    toast(
      `MenuItemReview Updated - id: ${MenuItemReview.id} itemId: ${MenuItemReview.itemId}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/menuitemreview?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/MenuItemReview" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit MenuItemReview</h1>
        {MenuItemReview && (
          <MenuItemReviewForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={MenuItemReview}
          />
        )}
      </div>
    </BasicLayout>
  );
}
