const express = require("express");
// --- CHANGEMENT D'IMPORTS ---
const { User, CandidateProfile, ClientProfile } = require("../models"); // Importer tous les modèles nécessaires
const { Op } = require("sequelize"); // Importer les opérateurs Sequelize
const { authenticateToken } = require("../middleware/auth");
const { logger } = require("../utils/logger");

module.exports = function (io) {
  const router = express.Router();

  // --- GET /api/users/search - Recherche d'utilisateurs (traduit pour Sequelize) ---
  router.get("/search", authenticateToken, async (req, res) => {
    try {
      const { query = "", role, page = 1, limit = 12 } = req.query;

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const offset = (pageNum - 1) * limitNum;

      const whereClause = {
        isActive: true,
        // La vérification `publicProfile` se fait au niveau du profil spécifique si nécessaire
      };
      
      if (role) {
        whereClause.role = role;
      }
      
      const includeOptions = [];
      const orConditions = [];

      // Construire la recherche textuelle
      if (query) {
        const iLikeQuery = { [Op.iLike]: `%${query}%` }; // Insensible à la casse

        if (!role || role === 'candidate') {
            includeOptions.push({
                model: CandidateProfile,
                as: 'candidateProfile',
                where: {
                    [Op.or]: [
                        { firstName: iLikeQuery },
                        { lastName: iLikeQuery },
                        { profession: iLikeQuery }
                    ]
                },
                required: !!role // Si un rôle est spécifié, la jointure est obligatoire
            });
        }
        
        if (!role || role === 'client') {
            includeOptions.push({
                model: ClientProfile,
                as: 'clientProfile',
                where: {
                    [Op.or]: [
                        { firstName: iLikeQuery },
                        { lastName: iLikeQuery },
                        { company: iLikeQuery }
                    ]
                },
                required: !!role
            });
        }
      } else {
        // Inclure les profils même sans requête textuelle pour récupérer les données complètes
        if (!role || role === 'candidate') includeOptions.push({ model: CandidateProfile, as: 'candidateProfile' });
        if (!role || role === 'client') includeOptions.push({ model: ClientProfile, as: 'clientProfile' });
      }


      const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        include: includeOptions,
        distinct: true, // Important avec les `include` pour un décompte correct
        limit: limitNum,
        offset: offset,
        order: [["createdAt", "DESC"]],
      });
      
      const totalPages = Math.ceil(count / limitNum);

      res.json({
        success: true,
        users: rows.map(user => user.getPublicProfile()),
        pagination: { currentPage: pageNum, totalPages, totalResults: count }
      });

    } catch (error) {
      logger.error("Erreur recherche utilisateurs:", error);
      res.status(500).json({ success: false, error: "Erreur serveur" });
    }
  });

  // --- GET /api/users/:id/profile - Récupérer et mettre à jour le profil (traduit pour Sequelize) ---
  router.get("/:id/profile", authenticateToken, async (req, res) => {
    try {
      const userIdToView = req.params.id;
      const viewer = req.user; 
      
      // Récupérer l'utilisateur à voir AVEC son profil associé
      const user = await User.findByPk(userIdToView, {
          include: [
              { model: CandidateProfile, as: 'candidateProfile' },
              { model: ClientProfile, as: 'clientProfile' }
          ]
      });

      if (!user) {
        return res.status(404).json({ success: false, error: "Utilisateur non trouvé" });
      }
      
      // La logique de condition reste la même
      const isViewerClientOrAdmin = viewer.role === "client" || viewer.role === "admin";
      const isViewingAnotherUser = viewer.id.toString() !== user.id.toString();
      const isViewedUserCandidate = user.role === "candidate";

      if (isViewerClientOrAdmin && isViewingAnotherUser && isViewedUserCandidate && user.candidateProfile) {
        
        // Incrémenter le compteur sur la table de profil séparée
        await user.candidateProfile.increment('profileViewCount', { by: 1 });
        logger.info(`Vue du profil candidat ${user.id} incrémentée par ${viewer.id}`);
      }

      // getPublicProfile est une méthode d'instance, elle fonctionnera toujours
      const userResponse = user.getPublicProfile();

      // Il faut manuellement attacher les données du profil si elles existent
      if (user.candidateProfile) userResponse.profile = user.candidateProfile.get({ plain: true });
      if (user.clientProfile) userResponse.profile = user.clientProfile.get({ plain: true });

      res.json({ success: true, user: userResponse });

    } catch (error) {
      logger.error("Erreur récupération profil utilisateur:", error);
      res.status(500).json({ success: false, error: "Erreur serveur" });
    }
  });

  return router;
};