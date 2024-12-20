import { useEffect, useState } from "react";
import { getMessage, sendMessage, deleteMessage } from "../services/api";
import { useParams } from "react-router-dom";
import { Trash2, Send, Menu } from "lucide-react";
import TopMenu from "./TopMenu";
import LeftMenu from "./LeftMenu";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import "../styles/Messages.css";
import { useNavigate } from "react-router-dom";


interface Message {
  id: string;
  content: string;
  sendAt?: string;
  emitterId?: string;
  isPending?: boolean;
}

interface User {
  id: string;
  username: string;
  isOnline: boolean;
  profilePicture?: string;
}

const MAX_CHARS = 500;

const canDeleteMessage = (message: Message): boolean => {
  const connectedUser = localStorage.getItem("connectedUser");
  return connectedUser === message.emitterId;
};

function Messages() {
  const { userId } = useParams<{ userId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId || !localStorage.getItem("connectedUser")) {  
      setError("Utilisateur non connecté.");
      navigate("/login");
      setIsLoading(false);
      
      return;
    }

    const fetchMessages = async () => {
      try {
        const data = await getMessage(userId);
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
  }, [navigate, userId]);

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
        await sendMessage(userId, newMessage);
        const connectedUser =
          localStorage.getItem("connectedUser") || undefined;

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now().toString(),
            content: newMessage,
            sendAt: new Date().toISOString(),
            emitterId: connectedUser,
          },
        ]);

        setNewMessage("");
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
    setNewMessage(e.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const remainingChars = MAX_CHARS - newMessage.length;
  const isOverLimit = remainingChars < 0;

  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      if (!message.sendAt) return;

      const date = parseISO(message.sendAt);
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

  const currentUser: User = {
    id: userId || "",
    username: localStorage.getItem("username") || "Utilisateur",
    isOnline: true,
    profilePicture: localStorage.getItem("profilePicture") || undefined,
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white dark:bg-black">
      <div className="md:hidden flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={toggleMenu}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className={`${isMenuOpen ? "block" : "hidden"}`}>
        <LeftMenu />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <TopMenu user={currentUser} />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-8">
          {isLoading && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              Chargement des messages...
            </p>
          )}

          {error && (
            <p className="text-center text-red-500 p-4 rounded-md bg-red-50 dark:bg-red-900/10 my-4">
              {error}
            </p>
          )}

          {!isLoading && !error && messages.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              Aucun message trouvé.
            </p>
          )}

          {!isLoading && !error && messages.length > 0 && (
            <div className="space-y-4 py-4">
              {Object.entries(groupMessagesByDate(messages))
                .sort(([date1], [date2]) => {
                  // Priorité pour "Aujourd'hui" et "Hier"
                  if (date1 === "Aujourd'hui") return -1;
                  if (date2 === "Aujourd'hui") return 1;
                  if (date1 === "Hier") return -1;
                  if (date2 === "Hier") return 1;

                  // Pour les autres dates, tri par date inverse (plus récent en haut)
                  const parsedDate1 = new Date(date1).getTime();
                  const parsedDate2 = new Date(date2).getTime();
                  return parsedDate2 - parsedDate1; // Plus récent en haut
                })
                .reverse()
                .map(([group, groupMessages]) => (
                  <div key={group} className="space-y-4">
                    <div className="text-center text-gray-500 dark:text-gray-400 relative">
                      <hr className="border-gray-200 dark:border-gray-800" />
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 bg-white dark:bg-black">
                        {group}
                      </span>
                    </div>
                    {groupMessages
                      .slice()
                      .sort((a, b) => {
                        const dateA = a.sendAt
                          ? parseISO(a.sendAt).getTime()
                          : 0;
                        const dateB = b.sendAt
                          ? parseISO(b.sendAt).getTime()
                          : 0;
                        return dateB - dateA; // Plus récent en haut
                      })
                      .map((message) => (
                        <div key={message.id} className="w-full flex mb-2">
                          <div
                            className={`w-full flex ${
                              canDeleteMessage(message)
                                ? "justify-end"
                                : "justify-start pl-0 md:pl-0"
                            }`}
                          >
                            <div
                              className={`relative group max-w-[90%] md:max-w-[80%] p-3 rounded-2xl ${
                                canDeleteMessage(message)
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white ml-0"
                              }`}
                            >
                              <p className="text-sm break-words">
                                {message.content}
                              </p>

                              {canDeleteMessage(message) && (
                                <button
                                  onClick={() =>
                                    handleDeleteMessage(message.id)
                                  }
                                  className="absolute -right-8 md:-right-10 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Supprimer le message"
                                  aria-label="Supprimer le message"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 p-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={handleMessageChange}
                placeholder="Écrivez votre message..."
                maxLength={MAX_CHARS}
                className={`w-full resize-none rounded-2xl border ${
                  isOverLimit
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-700"
                } bg-gray-100 dark:bg-gray-800 p-4 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                rows={1}
              />

              <button
                onClick={handleSendMessage}
                disabled={isSending || isOverLimit || newMessage.length === 0}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                title="Envoyer le message"
                aria-label="Envoyer le message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div
              className={`text-sm text-right mt-2 ${
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
