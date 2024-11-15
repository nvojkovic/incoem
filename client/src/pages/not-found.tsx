import { Link } from "react-router-dom";
import Button from "src/components/Inputs/Button";

const NotFound = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#f3f4f6]">
      <div className="border rounded-lg shadow-lg p-10 bg-white flex flex-col gap-4 items-center">
        <div className="text-2xl font-semibold flex gap-3 items-center">
          Page not found
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

export default NotFound;
