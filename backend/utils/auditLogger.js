// utils/auditLogger.js
const AuditLog = require('../models/AuditLog');

const logAudit = async (action, module, details, userId) => {
  try {
    await AuditLog.create({
      action,
      module,
      details,
      user: userId,
    });
  } catch (error) {
    console.error('Audit log failed:', error);
  }
};

module.exports = logAudit;
