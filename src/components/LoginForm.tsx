import { useEffect, useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import store from "../store/store";
import { Eye, EyeOff, LogIn, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const updateUserId = store.getState().updateUserId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(username, password);
      setSuccessMessage("Connexion réussie !");
      console.log("Connexion réussie :", username);
      setTimeout(() => {
        navigate("/message/611cf330-16c8-428d-ba99-41599339e6fb");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setError("Mot de passe ou nom d'utilisateur incorrect.");
      } else {
        console.error("Erreur lors de la connexion.");
        setError("Authentification impossible. Veuillez réessayer.");
      }
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("connectedUser");
    if (userId) {
      updateUserId(userId);
      navigate(`/message/611cf330-16c8-428d-ba99-41599339e6fb`);
    }
  }, [updateUserId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50 border border-green-500/20">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle className="text-green-500" size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">Connexion réussie</span>
              <span className="text-xs text-slate-400">
                Redirection en cours...
              </span>
            </div>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700 relative overflow-hidden"
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="text-center mb-8 relative">
            <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Bienvenue
            </h2>
            <p className="text-slate-400 text-lg">
              Connectez-vous pour continuer
            </p>
          </div>
          <div className="space-y-6 relative">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all hover:border-slate-500"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all hover:border-slate-500"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center mt-2 bg-red-500/10 py-2 px-3 rounded-lg">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30 hover:opacity-90 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <LogIn size={20} />
              <span>Se connecter</span>
            </button>
            <p className="text-center text-slate-400 text-sm pt-4">
              Vous n'avez pas de compte ?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
export default LoginForm;