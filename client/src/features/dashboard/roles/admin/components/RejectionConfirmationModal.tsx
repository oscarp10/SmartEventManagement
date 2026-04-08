import { useState } from "react";
import { XCircle } from "lucide-react";
import { Button } from "@/features/shared/components";
import { Textarea } from "@/features/shared/components";
import { Label } from "@/features/shared/components";

interface RejectionConfirmationModalProps {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function RejectionConfirmationModal({ onConfirm, onCancel }: RejectionConfirmationModalProps) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/25 p-6 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
        <div className="px-8 py-10">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <h3 className="mb-3 text-center text-xl font-semibold text-slate-900">Reject Event?</h3>
          <p className="mb-6 text-center text-slate-600">Are you sure you want to reject this event?</p>

          <div className="mb-6">
            <Label htmlFor="reason" className="mb-2 block">
              Rejection Reason (Optional)
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={4}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button onClick={onCancel} variant="secondary" className="w-full flex-1">
              Cancel
            </Button>
            <Button onClick={() => onConfirm(reason)} className="w-full flex-1">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

