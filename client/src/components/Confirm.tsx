import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Button from "./Inputs/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: any;
  onConfirm: () => void;
}

const Confirm = ({ isOpen, onClose, children, onConfirm }: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="transform bg-white p-6 shadow-xl transition-all rounded-xl w-96">
                <div className="flex flex-col gap-r">
                  {children}

                  <div className="flex flex-row-reverse justify-between gap-10 mt-5">
                    <Button type="primary" onClick={onConfirm}>
                      Confirm
                    </Button>
                    <Button type="secondary" onClick={onClose}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Confirm;
