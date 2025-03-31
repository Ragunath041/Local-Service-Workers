import { useState, useEffect, useRef } from "react";
import { Message, messagesApi } from "@/lib/messages";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  otherPartyId: string;
  otherPartyName: string;
  serviceId?: string;
  serviceTitle?: string;
  providerPhone?: string;
  providerEmail?: string;
}

export function ChatDialog({
  open,
  onOpenChange,
  otherPartyId,
  otherPartyName,
  serviceId,
  serviceTitle,
  providerPhone,
  providerEmail,
}: ChatDialogProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  const fetchMessages = async () => {
    if (!user?._id) return;
    
    try {
      const data = user.role === 'worker' 
        ? await messagesApi.getWorkerMessages(user._id)
        : await messagesApi.getUserMessages(user._id);
      
      // Filter messages for this conversation
      const conversationMessages = data.filter(msg => 
        (msg.senderId === user._id && msg.receiverId === otherPartyId) ||
        (msg.receiverId === user._id && msg.senderId === otherPartyId)
      );
      
      setMessages(conversationMessages);
      setIsLoading(false);

      // Mark unread messages as read
      for (const msg of conversationMessages) {
        if (!msg.read && msg.receiverId === user._id) {
          await messagesApi.markAsRead(msg._id);
        }
      }

      // Scroll to bottom when new messages arrive
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      toast.error("Failed to fetch messages");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMessages();
      // Start polling when dialog opens
      pollingIntervalRef.current = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    }

    return () => {
      // Clear polling interval when dialog closes
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [open, user?._id, otherPartyId]);

  const handleSendMessage = async () => {
    if (!user?._id || !newMessage.trim()) return;
    
    try {
      await messagesApi.createMessage({
        senderId: user._id,
        receiverId: otherPartyId,
        content: newMessage.trim(),
        serviceId,
      });
      setNewMessage("");
      await fetchMessages(); // Fetch immediately after sending
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Chat with {otherPartyName}</span>
            {serviceTitle && (
              <span className="text-sm text-gray-500">
                Re: {serviceTitle}
              </span>
            )}
          </DialogTitle>
          {(providerPhone || providerEmail) && (
            <div className="bg-gray-50 p-3 rounded-lg space-y-1 mt-2">
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
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <>
            <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.senderId === user?._id
                        ? "ml-auto bg-blue-500 text-white"
                        : "bg-gray-100"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2 pt-4">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 