import { useNavigate } from "react-router-dom";
import { NotFoundState } from "./PageNotFound";

export function BlogNotFound() {
  const navigate = useNavigate();

  return (
    <NotFoundState
      title="Blog Not Found"
      message="The blog you are looking for does not exist or may have been removed."
      buttonLabel="Browse All Blogs"
      onButtonClick={() => navigate("/blogs")}
    />
  );
}
