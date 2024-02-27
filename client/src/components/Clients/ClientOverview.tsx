import { TrashIcon } from "@heroicons/react/24/outline";
import icon from "../../assets/client-icon.png";
import { NavLink } from "react-router-dom";

const ClientOverview = ({
  client,
  onDelete,
}: {
  client: Client;
  onDelete: any;
}) => {
  return (
    <div className="border rounded-xl  border-[#EAECF0] flex-grow w-1/3 m-2">
      <div className="flex flex-col p-6 gap-4">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f2f4f7] border-gray-300 border flex items-center justify-center">
              <img src={icon} alt="" className="h-6" />
            </div>
            <div className="flex flex-col">
              <div className="font-semibold text-[16px]">{client.title}</div>
              <div className="text-[#475467] text-[14px]">
                {client.createdAt}
              </div>
            </div>
          </div>
          <button className="flex items-center">
            <TrashIcon className="h-5 w-5 text-red-500" onClick={onDelete} />
          </button>
        </div>
        <div className="border-t flex justify-end pt-4">
          <NavLink to={`/client/${client.id}`}>
            <div className="text-[#FF6C47] font-semibold text-[14px]">
              View income map
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;
