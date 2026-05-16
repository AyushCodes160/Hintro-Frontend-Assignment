import { useState } from "react";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { addFeedback } from "@/lib/feedback-store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const categories = ["Bug report", "Feature request", "UI / UX", "Other"];

export function FeedbackDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState(categories[0]);
  const [message, setMessage] = useState("");

  const reset = () => {
    setStep(1);
    setRating(0);
    setCategory(categories[0]);
    setMessage("");
  };

  const close = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const submit = () => {
    if (!message.trim()) {
      toast.error("Please share a few details");
      return;
    }
    addFeedback({ rating, category, message: message.trim() });
    toast.success("Thanks for the feedback!");
    close(false);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{step === 1 ? "How would you rate Hintro?" : "Tell us more"}</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Your feedback helps us improve every call.
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className="rounded-md p-1 transition-transform hover:scale-110"
                  aria-label={`Rate ${n}`}
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      n <= rating ? "fill-foreground text-foreground" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => close(false)}
                className="rounded-md border border-border px-4 py-1.5 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                disabled={rating === 0}
                onClick={() => setStep(2)}
                className="rounded-md bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                What can we improve?
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts…"
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-between gap-2">
              <button
                onClick={() => setStep(1)}
                className="rounded-md border border-border px-4 py-1.5 text-sm font-medium hover:bg-muted"
              >
                Back
              </button>
              <button
                onClick={submit}
                className="rounded-md bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
