import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError();
  return (
    <div>
      <p>
        {error.statusCode} {error.statusMessage}
      </p>
    </div>
  );
}
