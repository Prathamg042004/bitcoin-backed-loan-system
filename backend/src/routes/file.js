const express = require('express');
const passport = require('passport');
const router = express.Router();

// Legacy storage has no authoritative owner mapping. Fail closed rather than
// accepting client-selected paths or exposing documents across accounts.
const unavailable = (req, res) => res.status(503).json({
  error: 'File transfers are unavailable until owner-scoped storage is configured.',
});
router.get('/download', passport.authenticate('jwt', {session:false}), unavailable);
router.post('/upload/:table/:field', passport.authenticate('jwt', {session:false}), unavailable);
module.exports = router;
