// import React, { useEffect, useState } from "react";
// import { apiService } from "../services/api";
// import { useAuth } from "../contexts/AuthContext";
// import { Search, MapPin, Mail, MoreVertical, Filter } from "lucide-react";

// const AllTalents = () => {
//   const { user } = useAuth();
//   const [talents, setTalents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [filteredTalents, setFilteredTalents] = useState([]);
//   const [sortBy, setSortBy] = useState("relevance");

//   useEffect(() => {
//     const fetchTalents = async () => {
//       try {
//         setLoading(true);
//         const response = await apiService.users.search("");
//         setTalents(response.data || response);
//         setFilteredTalents(response.data || response);
//       } catch (error) {
//         console.error("Error fetching talents:", error);
//         setError("Failed to fetch talents");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTalents();
//   }, []);

//   useEffect(() => {
//     const filtered = talents.filter(
//       (talent) =>
//         (talent.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
//         (talent.skills ?? []).some((skill) =>
//           skill.toLowerCase().includes(search.toLowerCase())
//         ) ||
//         (talent.location ?? "").toLowerCase().includes(search.toLowerCase())
//     );
//     setFilteredTalents(filtered);
//   }, [search, talents]);

//   const TalentCard = ({ talent }) => (
//     <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative group">
//       {/* Menu points */}
//       <button className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
//         <MoreVertical className="w-5 h-5 text-gray-400" />
//       </button>

//       {/* Avatar avec statut en ligne */}
//       <div className="relative w-20 h-20 mx-auto mb-4">
//         <img
//           src={talent.avatar}
//           alt={talent.name}
//           className="w-full h-full rounded-full object-cover"
//         />
//         {talent.isOnline && (
//           <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-3 border-white flex items-center justify-center">
//             <div className="w-2 h-2 bg-white rounded-full"></div>
//           </div>
//         )}
//       </div>

//       {/* Nom */}
//       <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
//         {talent.name}
//       </h3>

//       {/* Localisation */}
//       <div className="flex items-center justify-center mb-3 text-gray-600">
//         <span className="text-sm">{talent.location}</span>
//       </div>

//       {/* Compétences */}
//       <div className="flex flex-wrap gap-1 justify-center mb-4">
//         {(talent.skills ?? []).map((skill, index) => (
//           <React.Fragment key={skill || index}>
//             <span className="text-sm text-gray-700">{skill}</span>
//             {index < (talent.skills?.length ?? 0) - 1 && (
//               <span className="text-gray-400">•</span>
//             )}
//           </React.Fragment>
//         ))}

//         {(!talent.skills || talent.skills.length === 0) && (
//           <span className="text-sm text-gray-400 italic">No skills listed</span>
//         )}
//       </div>

//       {/* Email */}
//       <div className="flex items-center justify-center text-gray-500">
//         <Mail className="w-4 h-4 mr-2" />
//         <span className="text-sm">{talent.email}</span>
//       </div>

//       {/* Overlay pour le lien */}
//       <button
//         onClick={() => console.log(`Voir le profil de ${talent.name}`)}
//         className="absolute inset-0 rounded-3xl hover:bg-black hover:bg-opacity-5 transition-all"
//         aria-label={`Voir le profil de ${talent.name}`}
//       />
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-6xl mx-auto">
//           <div className="animate-pulse">
//             <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
//             <div className="h-12 bg-gray-200 rounded-full mb-8"></div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(6)].map((_, i) => (
//                 <div key={i} className="bg-white rounded-3xl p-6 h-80">
//                   <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
//                   <div className="h-6 bg-gray-200 rounded mb-3"></div>
//                   <div className="h-4 bg-gray-200 rounded mb-3 w-2/3 mx-auto"></div>
//                   <div className="h-4 bg-gray-200 rounded mb-4 w-3/4 mx-auto"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-6">
//             Discover Freelancers
//           </h1>

//           {/* Barre de recherche */}
//           <div className="relative max-w-md">
//             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
//               <Search className="w-5 h-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-12 pr-12 py-3 bg-white border-0 rounded-full shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900 placeholder-gray-500"
//             />
//             <button className="absolute inset-y-0 right-2 flex items-center justify-center w-10 h-10 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors">
//               <Search className="w-5 h-5 text-white" />
//             </button>
//           </div>
//         </div>

//         {/* Message d'erreur */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//             <p className="text-red-600">{error}</p>
//           </div>
//         )}

//         {/* Grille des talents */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredTalents.map((talent) => (
//             <TalentCard key={talent.id} talent={talent} />
//           ))}
//         </div>

//         {/* Message si aucun résultat */}
//         {filteredTalents.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="max-w-md mx-auto">
//               <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 No talents found
//               </h3>
//               <p className="text-gray-500">
//                 Try adjusting your search criteria or explore all available
//                 talents.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Footer avec compteur */}
//         {filteredTalents.length > 0 && (
//           <div className="text-center mt-12 text-gray-500">
//             Showing {filteredTalents.length} of {talents.length} talents
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllTalents;

// src/pages/AllTalents.jsx

import React, { useEffect, useState, useCallback } from "react";
import { apiService } from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import TalentCard from "../components/UI/TalentCard";
import {
  MagnifyingGlassIcon as SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import FreelancerProfileModal from "../components/UI/FreelancerProfileModal";
import { useAuth } from "../contexts/AuthContext";
// Nouveau composant pour les boutons de pagination
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-4 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      <span className="font-medium">
        Page {currentPage} sur {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

const FreelancerCard = ({ user, onViewProfile }) => {
  const title =
    user.profile.profession ||
    (user.profile.skills && user.profile.skills[0]) ||
    "Talent Freelance";
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
              user.profile.fullName
            )}&background=2dd4bf&color=000&bold=true`
          }
          alt={user.profile.fullName}
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-white">
          {user.profile.fullName}
        </h3>
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
    </div>
  );
};

const AllTalents = () => {
  const { user } = useAuth();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Nouveaux états pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Utilisation de useCallback pour optimiser la fonction de fetch
  const fetchTalents = useCallback(async (page, query) => {
    try {
      setLoading(true);
      const response = await apiService.users.search(
        query,
        "candidate",
        page,
        12
      );
      setTalents(response.users || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setError("");
    } catch (err) {
      setError(
        "Impossible de charger les talents. Veuillez réessayer plus tard."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Premier chargement
  useEffect(() => {
    fetchTalents(1, "");
  }, [fetchTalents]);

  // Déclencher une nouvelle recherche lorsque l'utilisateur tape (avec un délai)
  useEffect(() => {
    // On met un délai (debounce) pour ne pas appeler l'API à chaque touche
    const timer = setTimeout(() => {
      setCurrentPage(1); // Revenir à la première page à chaque nouvelle recherche
      fetchTalents(1, searchTerm);
    }, 500); // Délai de 500ms

    return () => clearTimeout(timer); // Nettoyer le minuteur
  }, [searchTerm, fetchTalents]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchTalents(newPage, searchTerm);
    }
  };

  const handleViewProfile = async (freelancerPreview) => {
    // 1. Indiquer que la modale est en train de charger
    setIsModalLoading(true);
    setSelectedFreelancer(freelancerPreview); // On peut pré-remplir la modale avec les données de base

    try {
      // 2. APPEL CRUCIAL À L'API qui déclenche l'incrémentation du compteur
      const response = await apiService.users.getProfile(freelancerPreview.id);

      // 3. Mettre à jour la modale avec les données complètes et fraîches
      if (response.success) {
        setSelectedFreelancer(response.user);
      } else {
        setError("Impossible de charger le profil détaillé.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors du chargement du profil.");
      console.error(err);
    } finally {
      // 4. Arrêter l'état de chargement de la modale
      setIsModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedFreelancer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête et barre de recherche (inchangés) */}
        <div className="text-center md:text-left mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Découvrez nos Freelances
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Trouvez le talent parfait pour votre prochain projet.
          </p>
        </div>
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        </div>

        {/* Grille de résultats */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 font-semibold">{error}</p>
          </div>
        ) : talents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {talents.map((talent) => (
                <TalentCard
                  key={talent.id}
                  talent={talent}
                  onViewProfile={() => handleViewProfile(talent)}
                />
              ))}
            </div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">
              Aucun talent ne correspond à votre recherche.
            </p>
          </div>
        )}
      </div>
      {selectedFreelancer && (
        <FreelancerProfileModal
          freelancer={selectedFreelancer}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AllTalents;
