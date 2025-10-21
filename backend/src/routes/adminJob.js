const express = require("express");
const { Job } = require("../models");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { Op } = require("sequelize");

const router = express.Router();
router.use(authenticateToken, requireRole("admin"));

// GET /api/admin/jobs - Lister tous les jobs avec filtres
router.get("/", async (req, res) => {
  const { status, isFrozen, page = 1, limit = 15 } = req.query;
  const whereClause = {};
  if (status) whereClause.status = status;
  if (isFrozen) whereClause.isFrozen = isFrozen === "true";

  const { count, rows } = await Job.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: (page - 1) * limit,
    order: [["createdAt", "DESC"]],
  });

  res.json({
    success: true,
    jobs: rows,
    pagination: { total: count, page, limit },
  });
});

// PATCH /api/admin/jobs/:id/unfreeze - Dégeler un job
router.patch("/:id/unfreeze", async (req, res) => {
  const job = await Job.findByPk(req.params.id);
  if (!job)
    return res.status(404).json({ success: false, error: "Job non trouvé." });

  job.isFrozen = false;
  // On le remet en 'published' pour qu'il soit à nouveau visible normalement
  if (job.status === "reported") {
    job.status = "published";
  }
  await job.save();

  res.json({ success: true, job });
});

// DELETE /api/admin/jobs/:id - Supprimer un job
router.delete("/:id", async (req, res) => {
  const job = await Job.findByPk(req.params.id);
  if (!job)
    return res.status(404).json({ success: false, error: "Job non trouvé." });

  await job.destroy();
  res.json({ success: true, message: "Job supprimé avec succès." });
});

module.exports = router;
