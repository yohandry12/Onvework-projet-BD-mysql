import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import {
  BriefcaseIcon,
  HomeIcon,
  ClockIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import AnimatedIcon from "../components/UI/AnimatedIcon";
import FreelancerProfileModal from "../components/UI/FreelancerProfileModal";
import TestimonialsSection from "../pages/TestimonialsSection";

const CategoryCard = ({ name, icon, onClick }) => (
  <button
    onClick={onClick}
    className="group text-center p-6 bg-gray-800/50 rounded-2xl border border-white/10 hover:bg-emerald-900/50 transition-all duration-300 w-full"
  >
    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-700/60 rounded-xl text-3xl transition-colors">
      {icon}
    </div>
    <p className="font-semibold text-gray-200">{name}</p>
  </button>
);

const JobCard = ({ job }) => {
  const isCompleted = job.status === "filled";
  const isRepublished = !!job.clonedFromId;

  return (
    <article className="bg-gray-800/50 rounded-2xl border border-white/10 p-6 hover:border-emerald-400/50 transition-all duration-300 flex flex-col">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <h3
            className={`text-lg font-bold line-clamp-2 ${
              isCompleted ? "text-gray-600" : "text-white"
            }`}
          >
            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>

          {isRepublished && (
            <span className="flex items-center bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
              <ArrowPathIcon className="w-4 h-4 mr-1" />
              Republiée
            </span>
          )}

          {isCompleted && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
              Terminée
            </span>
          )}
        </div>

        <p className="text-sm text-gray-400 mb-4 line-clamp-3">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {job.requirements?.skills?.slice(0, 4).map((s, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 font-medium"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-sm text-gray-400">
          {job.client?.company ||
            (job.client?.firstName &&
              `${job.client.firstName} ${job.client.lastName}`) ||
            "Entreprise inconnue"}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="text-sm px-4 py-2 rounded-lg bg-emerald-400 text-black font-semibold hover:bg-emerald-500"
        >
          Voir
        </Link>
      </div>
    </article>
  );
};

const FreelancerCard = ({ user, onViewProfile }) => {
  const profile = user.profile || {};
  const title =
    user.profile.profession ||
    (user.profile.skills && user.profile.skills[0]) ||
    "Talent Freelance";
  const fullName =
    user.profile.fullName ||
    `${user.profile.firstName} ${user.profile.lastName}`;

  return (
    <div
      onClick={onViewProfile}
      className="bg-gray-800/50 rounded-2xl border border-white/10 p-6 flex flex-col items-center gap-4 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer"
    >
      <div className="relative">
        <img
          src={
            user.profile.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              fullName
            )}&background=2dd4bf&color=000&bold=true`
          }
          alt={fullName}
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-white">{fullName}</h3>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {user.profile.skills?.slice(0, 3).map((skill, idx) => (
          <span
            key={idx}
            className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-2 w-full px-4 py-2.5 text-center rounded-lg border-2 border-emerald-400 text-emerald-300 font-semibold">
        Voir le profil
      </div>
    </div>
  );
};

const CardSkeleton = () => (
  <div className="bg-gray-800/50 rounded-2xl border border-white/10 p-6 animate-pulse h-64">
    <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
  </div>
);

// --- Composant Principal de la Page d'Accueil ---

const Home = () => {
  // --- VOTRE LOGIQUE EST 100% CONSERVÉE ---
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categories] = useState([
    { name: "Marketing", icon: "📣", key: "marketing" },
    { name: "Développement", icon: "💻", key: "development" },
    { name: "Design", icon: "🎨", key: "design" },
    { name: "Rédaction", icon: "✍️", key: "writing" },
    { name: "Consulting", icon: "📊", key: "consulting" },
    { name: "Données", icon: "📈", key: "data" },
  ]);
  const [topFreelancers, setTopFreelancers] = useState([]);
  const [query, setQuery] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingFreelancers, setLoadingFreelancers] = useState(true);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoadingJobs(true);
    setLoadingFreelancers(true);

    Promise.allSettled([
      apiService.jobs.getAll({ limit: 6 }),
      // On appelle la recherche paginée, en demandant la page 1 avec une limite de 6
      apiService.users.search("", "candidate", 1, 6),
    ]).then(([jobsRes, usersRes]) => {
      if (!mounted) return;

      // Traitement des offres (inchangé)
      if (jobsRes.status === "fulfilled") {
        setFeaturedJobs(jobsRes.value.jobs || []);
      }
      setLoadingJobs(false);

      // --- CORRECTION CRUCIALE ICI ---
      // On traite la nouvelle structure de réponse paginée de l'API
      if (usersRes.status === "fulfilled") {
        // La liste des talents se trouve maintenant dans la clé "users" de la réponse
        setTopFreelancers(usersRes.value.users || []);
      }
      setLoadingFreelancers(false);
    });

    // Nettoyage au démontage du composant
    return () => {
      mounted = false;
    };
  }, []);

  // --- FONCTIONS POUR GÉRER LE MODAL ---
  const handleViewProfile = async (freelancerPreview) => {
    setIsModalLoading(true);
    setSelectedFreelancer(freelancerPreview); // Affiche la modale avec les données de base

    try {
      // APPEL API qui déclenche l'incrémentation du compteur !
      const response = await apiService.users.getProfile(freelancerPreview.id);

      if (response.success) {
        // Met à jour la modale avec les données complètes et fraîches
        setSelectedFreelancer(response.user);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil détaillé:", error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedFreelancer(null);
  };

  const onSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/jobs?search=${encodeURIComponent(query)}`);
  };

  const handleCategoryClick = (categoryKey) => {
    navigate(`/jobs?category=${categoryKey}`);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2020h40M20%200v40%22%20stroke%3D%22%232d2d2d%22%20stroke-width%3D%221%22%20stroke-linecap%3D%22square%22%2F%3E%3C%2Fsvg%3E')] opacity-50"></div>

      <div className="relative max-w-7xl mx-auto px-8">
        {/* LA SECTION HERO EST MAINTENANT LE FORMULAIRE DE RECHERCHE */}
        <section className="py-24 text-center">
          <div className="relative inline-block">
            {/* --- LES ANIMATIONS SONT PLACÉES ICI --- */}

            {/* Étoile filante (dessin) */}
            <AnimatedIcon
              className="-top-12 -right-24 text-white"
              animation="float"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 120 120"
                fill="none"
                width="120"
                height="120"
                className="your-classes"
              >
                {/* Traits filants */}
                <line
                  x1="10"
                  y1="60"
                  x2="50"
                  y2="60"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="20"
                  y1="50"
                  x2="50"
                  y2="60"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="20"
                  y1="70"
                  x2="50"
                  y2="60"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Étoile */}
                <path
                  d="M70 40 L75 55 L90 55 L78 65 L82 80 L70 72 L58 80 L62 65 L50 55 L65 55 Z"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </AnimatedIcon>

            {/* Petites étoiles scintillantes */}
            <AnimatedIcon
              className="top-12 -right-8 text-yellow-300 text-2xl"
              animation="pulse"
            >
              ✨
            </AnimatedIcon>

            {/* Étoile orange simple */}
            <AnimatedIcon
              className="bottom-0 -right-20 text-orange-500 text-4xl"
              animation="bounce"
            >
              ✦
            </AnimatedIcon>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Suivez vos <br /> rêves{" "}
              <span className="text-emerald-300">professionnels</span>
            </h1>
            {/* Soulignement SVG */}
            <svg
              className="mx-auto w-64 -mt-4"
              viewBox="0 0 200 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 5 10 C 25 20, 45 0, 65 10 S 105 20, 125 10 S 165 0, 185 10"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Explorez des milliers de missions en un seul endroit et obtenez le
            travail de vos rêves.
          </p>
          <form
            onSubmit={onSearch}
            className="flex max-w-xl mx-auto bg-white/5 rounded-lg overflow-hidden border border-white/20 shadow-lg backdrop-blur-sm"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex : React, Design, Marketing..."
              className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-400 text-black font-semibold hover:bg-emerald-500 transition-colors"
            >
              Rechercher
            </button>
          </form>
        </section>

        {/* LE RESTE DE LA PAGE CONTIENT VOS SECTIONS EXISTANTES, RESTYLISÉES */}
        <main className="py-16 space-y-20">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Par catégories</h2>
              <Link
                to="/jobs"
                className="text-sm font-medium text-emerald-300 hover:text-emerald-400"
              >
                Voir toutes
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {categories.map((c) => (
                <CategoryCard
                  key={c.key}
                  name={c.name}
                  icon={c.icon}
                  onClick={() => handleCategoryClick(c.key)}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                Offres en vedette
              </h2>
              <Link
                to="/jobs"
                className="text-sm font-medium text-emerald-300 hover:text-emerald-400"
              >
                Voir plus
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingJobs ? (
                [1, 2, 3].map((i) => <CardSkeleton key={i} />)
              ) : featuredJobs.length === 0 ? (
                <p className="col-span-full text-center text-gray-400 py-12">
                  Aucune offre en vedette pour l'instant.
                </p>
              ) : (
                featuredJobs.map((j) => <JobCard key={j.id} job={j} />)
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                Talents recommandés
              </h2>
              <Link
                to="/talents"
                className="text-sm font-medium text-emerald-300 hover:text-emerald-400"
              >
                Voir tout
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {loadingFreelancers
                ? [1, 2, 3].map((n) => (
                    <CardSkeleton key={`freelancer-skel-${n}`} />
                  ))
                : topFreelancers.map((freelancer) => (
                    <FreelancerCard
                      key={freelancer.id}
                      user={freelancer}
                      onViewProfile={() => handleViewProfile(freelancer)}
                    />
                  ))}
            </div>
          </section>

          <TestimonialsSection />

          <section className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 text-white rounded-2xl p-12 text-center border border-white/10">
            <>
              {user?.role === "candidate" && (
                <>
                  <h3 className="text-3xl font-bold mb-4">
                    Prêt à travailler ?
                  </h3>
                  <p className="mb-6 text-gray-300">
                    Créez un profil, postulez et gagnez des missions.
                  </p>
                </>
              )}
              {user?.role === "client" && (
                <>
                  <h3 className="text-3xl font-bold mb-4">Prêt à recruter ?</h3>
                  <p className="mb-6 text-gray-300">
                    Créez des offres et trouver des talents.
                  </p>
                </>
              )}
              {!isAuthenticated ? (
                <>
                  <h3 className="text-3xl font-bold mb-4">
                    Prêt à travailler ?
                  </h3>
                  <p className="mb-6 text-gray-300">
                    Créez un compte pour postuler à des offres et travailler
                    avec des clients ou des freelances.
                  </p>
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-lg bg-emerald-400 text-black font-semibold shadow hover:bg-emerald-500"
                  >
                    Créer mon compte
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-lg bg-white text-black font-semibold shadow hover:bg-gray-200"
                >
                  Aller au dashboard
                </Link>
              )}
            </>
          </section>
        </main>
      </div>
      {/* --- AFFICHAGE CONDITIONNEL DU MODAL --- */}
      {selectedFreelancer && (
        <FreelancerProfileModal
          freelancer={selectedFreelancer}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Home;
