import { CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ApprovalConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ApprovalConfirmationModal({ onConfirm, onCancel }: ApprovalConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/25 p-6 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="px-8 py-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-emerald-100 p-4">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-slate-900">Approve Event?</h3>
          <p className="mb-8 text-slate-600">Are you sure you want to approve this event?</p>
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

