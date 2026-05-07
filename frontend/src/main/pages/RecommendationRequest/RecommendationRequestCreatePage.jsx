import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({ storybook = false }) {
  const objectToAxiosParams = (recommendationRequest) => ({
    url: "/api/RecommendationRequests/post",
    method: "POST",
    params: {
      requesterEmail: recommendationRequest.requesterEmail,
      professorEmail: recommendationRequest.professorEmail,
      dateRequested: recommendationRequest.dateRequested,
      dateNeeded: recommendationRequest.dateNeeded,
      explanation: recommendationRequest.explanation,
      done: recommendationRequest.done,
    },
  });

  const onSuccess = (recommendationRequest) => {
    toast(
      `New recommendationRequest Created - id: ${recommendationRequest.id} explanation: ${recommendationRequest.explanation}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/RecommendationRequests/all"],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/RecommendationRequests" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Recommendation Request</h1>

        <RecommendationRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
