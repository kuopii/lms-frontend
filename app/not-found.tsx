import { GeneralError } from "@/components/pages/general-error";

export default function NotFound() {
  return (
    <GeneralError
      errorCode={404}
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      textButton="Go Home"
      withBackButton={true}
    />
  );
}
