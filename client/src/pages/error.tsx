import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Button from "src/components/Inputs/Button";

const Error = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#f3f4f6]">
      <div className="border rounded-lg shadow-lg p-10 bg-white flex flex-col gap-4 items-center">
        <div className="text-3xl font-semibold flex gap-3 items-center">
          <ExclamationTriangleIcon className="h-12 text-red-500" />
          Oops! Something went wrong.
        </div>
        <div className="max-w-96 text-center text-lg">
          We're sorry, but we're unable to complete your request right now. Our
          team has been automatically notified of this problem.
        </div>
        <div className="w-96 mt-5">
          <Link to="/clients">
            <Button type="primary">Go back to client overview</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
