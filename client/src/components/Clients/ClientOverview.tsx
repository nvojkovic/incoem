import { TrashIcon } from "@heroicons/react/24/outline";
import icon from "../../assets/client-icon.png";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Confirm from "../Confirm";

const ClientOverview = ({
  client,
  onDelete,
}: {
  client: Client;
  onDelete: any;
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <NavLink to={`/client/${client.id}/income`}>
      <div className="border rounded-xl  border-[#EAECF0] flex-grow w-full bg-white">
        <div className="flex flex-col p-6 gap-4">
          <div className="flex justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f2f4f7] border-gray-300 border flex items-center justify-center">
                <img src={icon} alt="" className="h-6" />
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-[16px]">{client.title}</div>
                <div className="text-[#475467] text-[14px]">
                  {new Date(client.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <button className="flex items-center">
              <TrashIcon
                className="h-5 w-5 text-main-orange cursor-pointer"
                onClick={(e) => {
                  setDeleteOpen(true);
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
              <Confirm
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={(i: any) => {
                  setDeleteOpen(false);
                  onDelete(i);
                }}
              >
                <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                <div className="mb-5">
                  Are you sure you want to delete this client?
                </div>
              </Confirm>
            </button>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default ClientOverview;
