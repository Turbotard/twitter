import { useEffect, useState } from "react";
import { getMessage, sendMessage, deleteMessage } from "../services/api";
import { useParams } from "react-router-dom";
import { Trash2, Send } from "lucide-react";
import { useStore } from "../store/store";
import TopMenu from "./TopMenu";
import LeftMenu from "./LeftMenu";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface Message {
  id: string;
  content: string;
  sendAt?: string;
  emitterId?: string;
  isPending?: boolean;
}

const MAX_CHARS = 500;

const canDeleteMessage = (message: Message): boolean => {
  const connectedUser = localStorage.getItem("connectedUser");
  return connectedUser === message.emitterId;
};

function Messages() {
  const { userId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const { userId: userId2 } = useStore();
  console.log(userId2);

  useEffect(() => {
    if (!userId) {
      setError("Utilisateur non connecté.");
      setIsLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const data = await getMessage(userId);
        console.log("Messages bruts récupérés :", data);
        setMessages(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erreur inconnue lors de la récupération des messages.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleSendMessage = async () => {
    if (!newMessage) {
      setError("Le message ne peut pas être vide.");
      return;
    }

    if (newMessage.length > MAX_CHARS) {
      setError(`Le message ne peut pas dépasser ${MAX_CHARS} caractères.`);
      return;
    }

    setIsSending(true);

    try {
      if (userId) {
        console.log(userId);
        await sendMessage(userId, newMessage);
        setNewMessage("");
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now().toString(), content: newMessage },
        ]);
        setError(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de l'envoi du message.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId)
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la suppression du message.");
      }
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNewMessage(text);
  };

  const remainingChars = MAX_CHARS - newMessage.length;
  const isOverLimit = remainingChars < 0;

  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = parseISO(message.sendAt || "");
      if (isToday(date)) {
        grouped["Aujourd'hui"] = grouped["Aujourd'hui"] || [];
        grouped["Aujourd'hui"].push(message);
      } else if (isYesterday(date)) {
        grouped["Hier"] = grouped["Hier"] || [];
        grouped["Hier"].push(message);
      } else {
        const formattedDate = format(date, "dd MMM yyyy", { locale: fr });
        grouped[formattedDate] = grouped[formattedDate] || [];
        grouped[formattedDate].push(message);
      }
    });

    return grouped;
  };  

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      <LeftMenu />
      <div className="flex-1 flex flex-col pl-80">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <TopMenu
            user={{
              id: userId || "",
              username: localStorage.getItem("username") || "Utilisateur",
              isOnline: true,
              profilePicture: localStorage.getItem("profilePicture") || undefined,
            }}
          />
        </div>
        <div className="flex-1 overflow-y-auto px-8">
          {isLoading && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Chargement des messages...
            </p>
          )}
          {error && (
            <p className="text-center text-red-500 p-2 rounded-md">{error}</p>
          )}
          {!isLoading && !error && messages.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Aucun message trouvé.
            </p>
          )}
          {!isLoading && !error && messages.length > 0 && (
            <div className="space-y-4 pl-4">
              {Object.entries(groupMessagesByDate(messages))
                .sort(([date1], [date2]) => {
                  if (date1 === "Aujourd'hui") return -1;
                  if (date1 === "Hier") return -1;
                  if (date2 === "Aujourd'hui") return 1;
                  if (date2 === "Hier") return 1;
                  return new Date(date2).getTime() - new Date(date1).getTime();
                })
                .map(([group, groupMessages]) => (
                  <div key={group}>
                    {/* Séparateur pour chaque groupe */}
                    <div className="text-center text-gray-500 dark:text-gray-400 mb-2">
                      <hr className="border-gray-300 dark:border-gray-700" />
                      <span className="px-4 bg-white dark:bg-black">{group}</span>
                    </div>
                    {groupMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          canDeleteMessage(message)
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`relative max-w-[80%] p-3 rounded-2xl ${
                            canDeleteMessage(message)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {canDeleteMessage(message) && (
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                              title="Supprimer le message"
                              aria-label="Supprimer le message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 px-12 py-4">
          <div className="flex flex-col space-y-2">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={handleMessageChange}
                placeholder="Écrivez votre message..."
                maxLength={MAX_CHARS}
                className={`w-full resize-none rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isOverLimit ? "border-red-500" : ""
                }`}
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || isOverLimit || newMessage.length === 0}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Envoyer le message"
                aria-label="Envoyer le message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div
              className={`text-sm text-right ${
                remainingChars <= 50
                  ? remainingChars <= 0
                    ? "text-red-500"
                    : "text-yellow-500"
                  : "text-gray-500"
              }`}
            >
              {remainingChars} caractères restants
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Messages;
