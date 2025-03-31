import { useState, useEffect } from "react";
import { Message, messagesApi } from "@/lib/messages";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChatDialog } from "./ChatDialog";

interface MessagesProps {
  className?: string;
}

export function Messages({ className }: MessagesProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{
    otherPartyId: string;
    otherPartyName: string;
    serviceId?: string;
    serviceTitle?: string;
  } | null>(null);

  const fetchMessages = async () => {
    if (!user?._id) return;
    
    try {
      const data = user.role === 'worker' 
        ? await messagesApi.getWorkerMessages(user._id)
        : await messagesApi.getUserMessages(user._id);
      
      // Group messages by conversation
      const groupedMessages = data.reduce((acc, msg) => {
        const otherId = msg.senderId === user._id ? msg.receiverId : msg.senderId;
        if (!acc[otherId]) {
          acc[otherId] = {
            otherPartyId: otherId,
            otherPartyName: msg.otherPartyName || 'Unknown',
            messages: [],
            serviceId: msg.serviceId,
            latestMessage: msg,
          };
        }
        acc[otherId].messages.push(msg);
        if (new Date(msg.createdAt) > new Date(acc[otherId].latestMessage.createdAt)) {
          acc[otherId].latestMessage = msg;
        }
        return acc;
      }, {} as Record<string, any>);

      // Convert to array and sort by latest message
      const conversations = Object.values(groupedMessages).sort((a, b) => 
        new Date(b.latestMessage.createdAt).getTime() - new Date(a.latestMessage.createdAt).getTime()
      );

      setMessages(conversations.map(c => c.latestMessage));
      
      // Get unread count
      const count = await messagesApi.getUnreadCount(user._id);
      setUnreadCount(count);
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch messages");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      fetchMessages();
    }
  }, [isDialogOpen, user?._id]);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("relative", className)}
          >
            <MessageCircle className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Messages</DialogTitle>
            <DialogDescription>
              View and send messages to service providers or users
            </DialogDescription>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <div className="space-y-4">
              <ScrollArea className="h-[300px] pr-4">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map(message => (
                      <Card
                        key={message._id}
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-gray-50",
                          !message.read && message.receiverId === user?._id && "bg-blue-50"
                        )}
                        onClick={() => {
                          setSelectedChat({
                            otherPartyId: message.senderId === user?._id ? message.receiverId : message.senderId,
                            otherPartyName: message.otherPartyName || 'Unknown',
                            serviceId: message.serviceId,
                          });
                          setIsDialogOpen(false);
                        }}
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-medium">
                            {message.otherPartyName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-gray-600">{message.content}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No messages yet
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {selectedChat && (
        <ChatDialog
          open={!!selectedChat}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedChat(null);
              fetchMessages();
            }
          }}
          otherPartyId={selectedChat.otherPartyId}
          otherPartyName={selectedChat.otherPartyName}
          serviceId={selectedChat.serviceId}
          serviceTitle={selectedChat.serviceTitle}
        />
      )}
    </>
  );
} 