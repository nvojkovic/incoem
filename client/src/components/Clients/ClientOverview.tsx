import { DocumentDuplicateIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Confirm from "../Confirm";
import { calculateAge } from "../Info/PersonInfo";
import { timeAgo } from "src/utils";
import Input from "../Inputs/Input";

const ClientOverview = ({
  client,
  i,
  onDelete,
  onDuplicate,
}: {
  client: Client;
  i: number;
  onDelete: any;
  onDuplicate: any;
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const na = useNavigate();
  return (
    <tr
      className={`${i % 2 == 1 ? "bg-[#F9FAFB]" : "bg-white"} cursor-pointer border-y border-[#EAECF0] hover:bg-slate-100`}
      onClick={() => na(`/client/${client.id}/income`)}
    >
      <td className="px-2 py-3 text-sm">{client.title}</td>
      <td className="px-2 py-1 text-sm text-gray-500">
        {timeAgo(new Date(client.createdAt))}
      </td>
      <td className="px-2 py-1 text-sm text-gray-500">
        {client.data.people
          .map(
            (person) =>
              `${person.name} (${calculateAge(new Date(person.birthday))})`,
          )
          .join(", ")}
      </td>
      <td
        className="px-2 py-1 "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex gap-3 items-center">
          <DocumentDuplicateIcon
            className="h-5 w-5 text-gray-800 cursor-pointer"
            onClick={(e) => {
              setDuplicateOpen(true);
              setNewName(client.title + " (2)");
              e.stopPropagation();
              e.preventDefault();
            }}
          />
          <TrashIcon
            className="h-5 w-5 text-main-orange cursor-pointer"
            onClick={(e) => {
              setDeleteOpen(true);
              e.stopPropagation();
              e.preventDefault();
            }}
          />
        </div>
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
        <Confirm
          isOpen={duplicateOpen}
          onClose={() => {
            setDuplicateOpen(false);
            setNewName("");
          }}
          onConfirm={() => {
            setDuplicateOpen(false);
            onDuplicate(client, newName);
          }}
        >
          <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
          <div className="mb-5">What should be the name of new client?</div>
          <Input
            width="w-full"
            value={newName}
            setValue={setNewName}
            label=""
          />
        </Confirm>
      </td>
    </tr>
  );
};

export default ClientOverview;
