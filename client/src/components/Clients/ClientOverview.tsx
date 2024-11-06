import { TrashIcon } from "@heroicons/react/24/outline";
import icon from "../../assets/client-icon.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Confirm from "../Confirm";
import { calculateAge } from "../Info/PersonInfo";

const ClientOverview2 = ({
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

const ClientOverview = ({
  client,
  i,
  onDelete,
}: {
  client: Client;
  i: number;
  onDelete: any;
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const na = useNavigate();
  return (
    <tr
      className={`${i % 2 == 1 ? "bg-[#F9FAFB]" : "bg-white"} cursor-pointer border-y border-[#EAECF0] hover:bg-slate-100`}
      onClick={() => na(`/client/${client.id}/income`)}
    >
      <td className="px-2 py-2 w-[500px]">{client.title}</td>
      <td className="px-2 py-1 w-[500px]">
        {new Date(client.createdAt).toLocaleDateString()}
      </td>
      <td className="px-2 py-1 w-[500px]">
        {client.data.people
          .map(
            (person) =>
              `${person.name} (${calculateAge(new Date(person.birthday))})`,
          )
          .join(", ")}
      </td>
      <td className="px-2 py-1">
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
      </td>
    </tr>
  );
};

export default ClientOverview;
