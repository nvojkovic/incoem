import { useState } from "react";
import Modal from "./Modal";
import { ChartBarIcon } from "@heroicons/react/24/outline";

interface ChartModalProps {
  children: React.ReactNode;
  buttonClassName?: string;
}

const ChartModal = ({ children, buttonClassName = "" }: ChartModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`hover:text-gray-600 transition-colors ${buttonClassName}`}
      >
        <ChartBarIcon className="w-6 h-6" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {children}
      </Modal>
    </>
  );
};

export default ChartModal;
