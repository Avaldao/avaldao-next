import { X } from "lucide-react";
import { ReactNode } from "react";

type ResponsiveModalProps = {
  closeOnBackdropClick?: boolean,
  closeModal: () => void,
  title: string;
  body?: ReactNode;
  buttons?: ReactNode;
  className?: string; 
};

export default function ResponsiveModal({
  closeModal,
  closeOnBackdropClick = true,
  title,
  body: child,
  buttons,
  className
}: ResponsiveModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000"
      onClick={() => closeOnBackdropClick && closeModal()}
    >
      {/* Modal Content */}
      <div
        className={`bg-white rounded-2xl shadow-lg p-6 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 sm:min-w-[550px] ${className}`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={() => closeModal()}>
            <X className="w-6 h-6 text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* Body */}
        <div className="text-gray-700">{child}</div>

        {/* Footer / Buttons */}
        {buttons && (
          <div className="mt-4 flex justify-end gap-2">{buttons}</div>
        )}
      </div>
    </div>
  );
}
