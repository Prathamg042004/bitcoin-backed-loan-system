const db = require('../models');
const Users = db.users;

const Loans = db.loans;

const VirtualWallets = db.virtual_wallets;

const LoansData = [
  {
    // type code here for "relation_one" field

    loan_amount: 5000,

    bitcoin_collateral: 0.5,

    interest_rate: 5.5,

    loan_sanction_date: new Date('2023-10-01T10:00:00Z'),

    bank_account_details: 'Bank of Example, Account No: 123456789',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    loan_amount: 10000,

    bitcoin_collateral: 1,

    interest_rate: 4.5,

    loan_sanction_date: new Date('2023-09-15T14:30:00Z'),

    bank_account_details: 'Example Bank, Account No: 987654321',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    loan_amount: 7500,

    bitcoin_collateral: 0.75,

    interest_rate: 6,

    loan_sanction_date: new Date('2023-08-20T09:00:00Z'),

    bank_account_details: 'Sample Bank, Account No: 112233445',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    loan_amount: 3000,

    bitcoin_collateral: 0.3,

    interest_rate: 5,

    loan_sanction_date: new Date('2023-07-10T11:15:00Z'),

    bank_account_details: 'Bank of Sample, Account No: 556677889',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    loan_amount: 15000,

    bitcoin_collateral: 1.5,

    interest_rate: 4,

    loan_sanction_date: new Date('2023-06-05T16:45:00Z'),

    bank_account_details: 'Example Bank, Account No: 998877665',

    // type code here for "relation_one" field
  },
];

const VirtualWalletsData = [
  {
    // type code here for "relation_one" field

    bitcoin_balance: 0.5,
  },

  {
    // type code here for "relation_one" field

    bitcoin_balance: 1,
  },

  {
    // type code here for "relation_one" field

    bitcoin_balance: 0.75,
  },

  {
    // type code here for "relation_one" field

    bitcoin_balance: 0.3,
  },

  {
    // type code here for "relation_one" field

    bitcoin_balance: 1.5,
  },
];

// Similar logic for "relation_many"

async function associateLoanWithBorrower() {
  const relatedBorrower0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Loan0 = await Loans.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Loan0?.setBorrower) {
    await Loan0.setBorrower(relatedBorrower0);
  }

  const relatedBorrower1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Loan1 = await Loans.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Loan1?.setBorrower) {
    await Loan1.setBorrower(relatedBorrower1);
  }

  const relatedBorrower2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Loan2 = await Loans.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Loan2?.setBorrower) {
    await Loan2.setBorrower(relatedBorrower2);
  }

  const relatedBorrower3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Loan3 = await Loans.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Loan3?.setBorrower) {
    await Loan3.setBorrower(relatedBorrower3);
  }

  const relatedBorrower4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Loan4 = await Loans.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Loan4?.setBorrower) {
    await Loan4.setBorrower(relatedBorrower4);
  }
}

async function associateLoanWithLender() {
  const relatedLender0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Loan0 = await Loans.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Loan0?.setLender) {
    await Loan0.setLender(relatedLender0);
  }

  const relatedLender1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Loan1 = await Loans.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Loan1?.setLender) {
    await Loan1.setLender(relatedLender1);
  }

  const relatedLender2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Loan2 = await Loans.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Loan2?.setLender) {
    await Loan2.setLender(relatedLender2);
  }

  const relatedLender3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Loan3 = await Loans.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Loan3?.setLender) {
    await Loan3.setLender(relatedLender3);
  }

  const relatedLender4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Loan4 = await Loans.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Loan4?.setLender) {
    await Loan4.setLender(relatedLender4);
  }
}

async function associateVirtualWalletWithOwner() {
  const relatedOwner0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const VirtualWallet0 = await VirtualWallets.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (VirtualWallet0?.setOwner) {
    await VirtualWallet0.setOwner(relatedOwner0);
  }

  const relatedOwner1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const VirtualWallet1 = await VirtualWallets.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (VirtualWallet1?.setOwner) {
    await VirtualWallet1.setOwner(relatedOwner1);
  }

  const relatedOwner2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const VirtualWallet2 = await VirtualWallets.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (VirtualWallet2?.setOwner) {
    await VirtualWallet2.setOwner(relatedOwner2);
  }

  const relatedOwner3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const VirtualWallet3 = await VirtualWallets.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (VirtualWallet3?.setOwner) {
    await VirtualWallet3.setOwner(relatedOwner3);
  }

  const relatedOwner4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const VirtualWallet4 = await VirtualWallets.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (VirtualWallet4?.setOwner) {
    await VirtualWallet4.setOwner(relatedOwner4);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Loans.bulkCreate(LoansData);

    await VirtualWallets.bulkCreate(VirtualWalletsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateLoanWithBorrower(),

      await associateLoanWithLender(),

      await associateVirtualWalletWithOwner(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('loans', null, {});

    await queryInterface.bulkDelete('virtual_wallets', null, {});
  },
};
