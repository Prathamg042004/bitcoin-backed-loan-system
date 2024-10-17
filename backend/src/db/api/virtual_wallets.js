const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Virtual_walletsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const virtual_wallets = await db.virtual_wallets.create(
      {
        id: data.id || undefined,

        bitcoin_balance: data.bitcoin_balance || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await virtual_wallets.setOwner(data.owner || null, {
      transaction,
    });

    return virtual_wallets;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const virtual_walletsData = data.map((item, index) => ({
      id: item.id || undefined,

      bitcoin_balance: item.bitcoin_balance || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const virtual_wallets = await db.virtual_wallets.bulkCreate(
      virtual_walletsData,
      { transaction },
    );

    // For each item created, replace relation files

    return virtual_wallets;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const virtual_wallets = await db.virtual_wallets.findByPk(
      id,
      {},
      { transaction },
    );

    await virtual_wallets.update(
      {
        bitcoin_balance: data.bitcoin_balance || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await virtual_wallets.setOwner(data.owner || null, {
      transaction,
    });

    return virtual_wallets;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const virtual_wallets = await db.virtual_wallets.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of virtual_wallets) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of virtual_wallets) {
        await record.destroy({ transaction });
      }
    });

    return virtual_wallets;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const virtual_wallets = await db.virtual_wallets.findByPk(id, options);

    await virtual_wallets.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await virtual_wallets.destroy({
      transaction,
    });

    return virtual_wallets;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const virtual_wallets = await db.virtual_wallets.findOne(
      { where },
      { transaction },
    );

    if (!virtual_wallets) {
      return virtual_wallets;
    }

    const output = virtual_wallets.get({ plain: true });

    output.owner = await virtual_wallets.getOwner({
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
        as: 'owner',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.bitcoin_balanceRange) {
        const [start, end] = filter.bitcoin_balanceRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            bitcoin_balance: {
              ...where.bitcoin_balance,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            bitcoin_balance: {
              ...where.bitcoin_balance,
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

      if (filter.owner) {
        const listItems = filter.owner.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          ownerId: { [Op.or]: listItems },
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
          count: await db.virtual_wallets.count({
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
      : await db.virtual_wallets.findAndCountAll({
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
          Utils.ilike('virtual_wallets', 'bitcoin_balance', query),
        ],
      };
    }

    const records = await db.virtual_wallets.findAll({
      attributes: ['id', 'bitcoin_balance'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['bitcoin_balance', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.bitcoin_balance,
    }));
  }
};
