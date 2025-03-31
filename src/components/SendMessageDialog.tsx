import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { messagesApi } from "@/lib/messages";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiverId: string;
  receiverName: string;
  serviceId: string;
  serviceTitle: string;
  providerPhone?: string;
  providerEmail?: string;
}

export function SendMessageDialog({
  open,
  onOpenChange,
  receiverId,
  receiverName,
  serviceId,
  serviceTitle,
  providerPhone,
  providerEmail,
}: SendMessageDialogProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!user?._id) {
      toast.error("Please log in to send messages");
      return;
    }

    setIsSending(true);
    try {
      await messagesApi.createMessage({
        senderId: user._id,
        receiverId,
        content: message,
        serviceId,
      });
      toast.success("Message sent successfully!");
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Message to {receiverName}</DialogTitle>
          <DialogDescription>
            Regarding service: {serviceTitle}
          </DialogDescription>
        </DialogHeader>
        {(providerPhone || providerEmail) && (
          <>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              {providerPhone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{providerPhone}</span>
                </div>
              )}
              {providerEmail && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{providerEmail}</span>
                </div>
              )}
            </div>
            <Separator />
          </>
        )}
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
