import { Service } from "@/lib/services";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MessageCircle, MapPinIcon, Send, Phone, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { messagesApi } from "@/lib/messages";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface ServiceCardProps {
  service: Service;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isPending?: boolean;
}

export function ServiceCard({ service, onApprove, onReject, isPending }: ServiceCardProps) {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }[service.status];

  const handleSendMessage = async () => {
    if (!user?._id || !newMessage.trim()) return;
    
    try {
      const messageData = {
        senderId: user._id,
        receiverId: service.workerId,
        content: newMessage.trim(),
        serviceId: service._id,
      };
      
      await messagesApi.createMessage(messageData);
      setNewMessage("");
      toast.success("Message sent successfully");
      setIsMessagesOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    }
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
            <Badge className={statusColor}>{service.status}</Badge>
          </div>
          <div className="text-sm text-gray-500">
            <div className="flex items-center mt-2">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{service.location}</span>
            </div>
            <div className="mt-1">Added on {new Date(service.createdAt).toLocaleDateString()}</div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-gray-600 mb-4">{service.description}</div>
          <div className="space-y-2">
            <Badge variant="outline">{service.category}</Badge>
            <div className="font-semibold text-lg">${service.price}</div>
            {service.providerName && (
              <div className="text-sm text-gray-500">
                Provider: {service.providerName}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          {isPending ? (
            <>
              <Button
                variant="outline"
                onClick={() => onReject?.(service._id)}
                className="text-red-600 hover:text-red-700"
              >
                Reject
              </Button>
              <Button
                onClick={() => onApprove?.(service._id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
            </>
          ) : (
            service.status === 'approved' && user?.role === 'user' && (
              <Button
                className="w-full"
                onClick={() => setIsMessagesOpen(true)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Provider
              </Button>
            )
          )}
        </CardFooter>
      </Card>

      <Dialog open={isMessagesOpen} onOpenChange={setIsMessagesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Provider</DialogTitle>
            <DialogDescription>
              Send a message to {service.providerName} about {service.title}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{service.providerPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{service.providerEmail}</span>
              </div>
            </div>
            <Separator />
            <div className="flex gap-2">
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 