import { TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Confirm from "../Confirm";
import { calculateAge } from "../Info/PersonInfo";

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
      <td className="px-2 py-3 w-[500px]">{client.title}</td>
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
      <td
        className="px-2 py-1"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
