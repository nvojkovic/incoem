import { useState } from "react";
import Modal from "./Modal";

interface ChartModalProps {
  children: React.ReactNode;
  buttonClassName?: string;
  onClose?: () => void;
}

const ChartModal = ({
  children,
  buttonClassName = "",
  onClose,
}: ChartModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`hover:text-gray-600 transition-colors ${buttonClassName} pl-4`}
      >
        <img src="/icons/expand.png" className="h-6 w-6 cursor-pointer" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          onClose && onClose();
        }}
      >
        <div className="w-[90vw] h-full">{children}</div>
      </Modal>
    </>
  );
};

export default ChartModal;
