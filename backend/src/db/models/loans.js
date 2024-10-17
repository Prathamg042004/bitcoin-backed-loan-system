const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const loans = sequelize.define(
    'loans',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      loan_amount: {
        type: DataTypes.DECIMAL,
      },

      bitcoin_collateral: {
        type: DataTypes.DECIMAL,
      },

      interest_rate: {
        type: DataTypes.DECIMAL,
      },

      loan_sanction_date: {
        type: DataTypes.DATE,
      },

      bank_account_details: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  loans.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.loans.belongsTo(db.users, {
      as: 'borrower',
      foreignKey: {
        name: 'borrowerId',
      },
      constraints: false,
    });

    db.loans.belongsTo(db.users, {
      as: 'lender',
      foreignKey: {
        name: 'lenderId',
      },
      constraints: false,
    });

    db.loans.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.loans.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return loans;
};
