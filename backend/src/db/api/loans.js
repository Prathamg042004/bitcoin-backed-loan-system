const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class LoansDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const loans = await db.loans.create(
      {
        id: data.id || undefined,

        loan_amount: data.loan_amount || null,
        bitcoin_collateral: data.bitcoin_collateral || null,
        interest_rate: data.interest_rate || null,
        loan_sanction_date: data.loan_sanction_date || null,
        bank_account_details: data.bank_account_details || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await loans.setBorrower(data.borrower || null, {
      transaction,
    });

    await loans.setLender(data.lender || null, {
      transaction,
    });

    return loans;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const loansData = data.map((item, index) => ({
      id: item.id || undefined,

      loan_amount: item.loan_amount || null,
      bitcoin_collateral: item.bitcoin_collateral || null,
      interest_rate: item.interest_rate || null,
      loan_sanction_date: item.loan_sanction_date || null,
      bank_account_details: item.bank_account_details || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const loans = await db.loans.bulkCreate(loansData, { transaction });

    // For each item created, replace relation files

    return loans;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const loans = await db.loans.findByPk(id, {}, { transaction });

    await loans.update(
      {
        loan_amount: data.loan_amount || null,
        bitcoin_collateral: data.bitcoin_collateral || null,
        interest_rate: data.interest_rate || null,
        loan_sanction_date: data.loan_sanction_date || null,
        bank_account_details: data.bank_account_details || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await loans.setBorrower(data.borrower || null, {
      transaction,
    });

    await loans.setLender(data.lender || null, {
      transaction,
    });

    return loans;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const loans = await db.loans.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of loans) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of loans) {
        await record.destroy({ transaction });
      }
    });

    return loans;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const loans = await db.loans.findByPk(id, options);

    await loans.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await loans.destroy({
      transaction,
    });

    return loans;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const loans = await db.loans.findOne({ where }, { transaction });

    if (!loans) {
      return loans;
    }

    const output = loans.get({ plain: true });

    output.borrower = await loans.getBorrower({
      transaction,
    });

    output.lender = await loans.getLender({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.users,
        as: 'borrower',
      },

      {
        model: db.users,
        as: 'lender',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.bank_account_details) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'loans',
            'bank_account_details',
            filter.bank_account_details,
          ),
        };
      }

      if (filter.loan_amountRange) {
        const [start, end] = filter.loan_amountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            loan_amount: {
              ...where.loan_amount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            loan_amount: {
              ...where.loan_amount,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.bitcoin_collateralRange) {
        const [start, end] = filter.bitcoin_collateralRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            bitcoin_collateral: {
              ...where.bitcoin_collateral,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            bitcoin_collateral: {
              ...where.bitcoin_collateral,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.interest_rateRange) {
        const [start, end] = filter.interest_rateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            interest_rate: {
              ...where.interest_rate,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            interest_rate: {
              ...where.interest_rate,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.loan_sanction_dateRange) {
        const [start, end] = filter.loan_sanction_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            loan_sanction_date: {
              ...where.loan_sanction_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            loan_sanction_date: {
              ...where.loan_sanction_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.borrower) {
        const listItems = filter.borrower.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          borrowerId: { [Op.or]: listItems },
        };
      }

      if (filter.lender) {
        const listItems = filter.lender.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          lenderId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.loans.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.loans.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('loans', 'loan_amount', query),
        ],
      };
    }

    const records = await db.loans.findAll({
      attributes: ['id', 'loan_amount'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['loan_amount', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.loan_amount,
    }));
  }
};
