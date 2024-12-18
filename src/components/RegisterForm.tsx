import { useState } from "react";
import { register } from "../services/api";
import { Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation");
      return;
    }

    try {
      await register(username, password);
      setSuccessMessage("Inscription réussie !");
      console.log("Inscription réussie :", username);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Erreur d'inscription :", err.message);
        setError(
          "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
        );
      } else {
        console.error("Erreur lors de l'inscription.");
        setError("Erreur inattendue. Veuillez réessayer plus tard.");
      }
    }
  };

  const navLogin = () => {
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50 border border-green-500/20">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle className="text-green-500" size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">Inscription réussie</span>
              <span className="text-xs text-slate-400">
                Redirection en cours...
              </span>
            </div>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-3">Inscription</h2>
            <p className="text-slate-400 text-lg">
              Créez votre compte pour commencer
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                placeholder="Choisissez un nom d'utilisateur"
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
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  placeholder="Choisissez un mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="accept-terms"
                required
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
              />
              <label htmlFor="accept-terms" className="text-sm text-slate-300">
                J'accepte les conditions d'utilisation et la politique de
                confidentialité
              </label>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center mt-2">{error}</p>
            )}

            {successMessage && (
              <p className="text-green-400 text-sm text-center mt-2">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30"
            >
              <UserPlus size={20} />
              <span>S'inscrire</span>
            </button>

            <p className="text-center text-slate-400 text-sm">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
