import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface PendingConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function PendingConfirmationModal({ onConfirm, onCancel }: PendingConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/25 p-6 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="px-8 py-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-blue-100 p-4">
              <RefreshCw className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-slate-900">Mark as Pending?</h3>
          <p className="mb-8 text-slate-600">Move this event back to pending status?</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button onClick={onCancel} variant="secondary" className="w-full flex-1">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="w-full flex-1">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

