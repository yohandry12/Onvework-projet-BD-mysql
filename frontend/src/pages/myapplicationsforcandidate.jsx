// src/pages/MyApplications.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../services/api";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  BriefcaseIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const ApplicationCard = ({ application, onWithdraw }) => {
  const { job, status } = application;

  const statusInfo = {
    accepted: {
      text: "Acceptée",
      icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    pending: {
      text: "En attente",
      icon: <ClockIcon className="h-5 w-5 text-yellow-500" />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
    },
    rejected: {
      text: "Refusée",
      icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
      bgColor: "bg-red-50",
      textColor: "text-red-800",
    },
    reviewed: {
      text: "Examinée",
      icon: <ClockIcon className="h-5 w-5 text-blue-500" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    },
    shortlisted: {
      text: "Présélectionnée",
      icon: <CheckCircleIcon className="h-5 w-5 text-indigo-500" />,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-800",
    },
    interviewed: {
      text: "Entretien",
      icon: <CheckCircleIcon className="h-5 w-5 text-purple-500" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
    },
    withdrawn: {
      text: "Retirée",
      icon: <XCircleIcon className="h-5 w-5 text-gray-500" />,
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
    },
    // Fallback pour les statuts inconnus
    default: {
      text: "Inconnu",
      icon: <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />,
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
    },
  };
  const currentStatus = statusInfo[status] || statusInfo.pending;

  const handleWithdraw = async () => {
    if (
      window.confirm("Êtes-vous sûr de vouloir retirer votre candidature ?")
    ) {
      try {
        // CORRIGÉ: Utiliser application.id
        await apiService.applications.withdraw(application.id);
        alert("Candidature retirée avec succès.");
        onWithdraw(application.id);
      } catch (error) {
        alert("Erreur lors du retrait de la candidature.");
      }
    }
  };

  if (!job) return null;

  // CORRIGÉ: Adapter l'accès aux données du client
  const companyName = job.client?.profile?.company || "Entreprise inconnue";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg">
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-bold">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{companyName}</p>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full h-fit text-sm ${currentStatus.bgColor} ${currentStatus.textColor}`}
        >
          {currentStatus.icon}
          <span className="font-semibold capitalize">{currentStatus.text}</span>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        {status === "pending" && (
          <button
            onClick={handleWithdraw}
            className="px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
          >
            Retirer
          </button>
        )}
        {/* CORRIGÉ: Utiliser job.id */}
        <Link
          to={`/jobs/${job.id}`}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Voir l'offre
        </Link>
      </div>
    </div>
  );
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await apiService.applications.getByUser();

        // --- CORRECTION CLÉ ICI ---
        // On vérifie la réponse et on extrait la clé 'data' qui contient le tableau.
        if (response.success && Array.isArray(response.data)) {
          setApplications(response.data);
        } else {
          setApplications([]); // On met un tableau vide si la réponse est invalide
        }
      } catch (error) {
        console.error("Erreur fetching applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleApplicationWithdrawn = (withdrawnAppId) => {
    // CORRIGÉ: Utiliser .id
    setApplications((prev) => prev.filter((app) => app.id !== withdrawnAppId));
  };

  // Le reste du code était déjà correct, il fallait juste que `applications` soit un tableau.
  const acceptedApps = applications.filter((app) => app.status === "accepted");
  const pendingApps = applications.filter((app) => app.status === "pending");
  const otherApps = applications.filter(
    (app) => !["accepted", "pending"].includes(app.status)
  );

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Mes Candidatures
      </h1>

      {applications.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-lg shadow-sm">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Aucune candidature trouvée
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Vous n'avez postulé à aucune offre pour le moment.
          </p>
          <div className="mt-6">
            <Link
              to="/jobs"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg"
            >
              Trouver des missions
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {acceptedApps.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold ...">Missions Acceptées</h2>
              <div className="grid gap-6">
                {acceptedApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onWithdraw={handleApplicationWithdrawn}
                  />
                ))}
              </div>
            </section>
          )}

          {pendingApps.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold ...">
                Candidatures en Attente
              </h2>
              <div className="grid gap-6">
                {pendingApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onWithdraw={handleApplicationWithdrawn}
                  />
                ))}
              </div>
            </section>
          )}

          {otherApps.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold ...">Historique</h2>
              <div className="grid gap-6">
                {otherApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onWithdraw={handleApplicationWithdrawn}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
