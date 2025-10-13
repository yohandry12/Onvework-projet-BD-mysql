const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Application extends Model {}

  Application.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // Les champs 'jobId', 'candidateId', 'clientId' seront créés par les associations
      coverLetter: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "cover_letter",
        validate: {
          len: {
            args: [50, 2500],
            msg: "La lettre de motivation doit contenir entre 50 et 2500 caractères.",
          },
        },
      },
      attachments: {
        type: DataTypes.JSON, // Stocker le tableau d'objets en JSON
        defaultValue: [],
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "reviewed",
          "accepted",
          "rejected",
          "withdrawn"
        ),
        defaultValue: "pending",
        allowNull: false,
      },
      clientNotes: {
        type: DataTypes.TEXT,
        field: "client_notes",
      },
      history: {
        type: DataTypes.JSON, // L'historique est parfait pour un champ JSON
        defaultValue: [],
      },
      withdrawnReason: {
        type: DataTypes.STRING,
        field: "withdrawn_reason",
      },
    },
    {
      sequelize,
      modelName: "Application",
      tableName: "applications",
      timestamps: true, // Sequelize gère createdAt et updatedAt
      underscored: true,
      indexes: [
        // Index composé pour l'unicité
        { unique: true, fields: ["job_id", "candidate_id"] },
      ],
      hooks: {
        // Hook avant la création pour initialiser l'historique
        beforeCreate: (application, options) => {
          application.history = [
            {
              event: "created",
              user: application.candidateId,
              details: "Candidature soumise.",
              timestamp: new Date(),
            },
          ];
        },
        // Hook après sauvegarde (création ou mise à jour) pour le compteur
        // afterSave: async (application, options) => {
        //     try {
        //         const Job = sequelize.models.Job;
        //         const count = await sequelize.models.Application.count({ where: { jobId: application.jobId } });
        //         await Job.update({ applicationCount: count }, { where: { id: application.jobId } });
        //     } catch(error) {
        //         console.error("Erreur du hook afterSave sur Application:", error);
        //     }
        // }
      },
    }
  );

  return Application;
};
