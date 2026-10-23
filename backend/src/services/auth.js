const UsersDBApi = require('../db/api/users');
const ValidationError = require('./notifications/errors/validation');
const ForbiddenError = require('./notifications/errors/forbidden');
const bcrypt = require('bcrypt');
const EmailAddressVerificationEmail = require('./email/list/addressVerification');
const InvitationEmail = require('./email/list/invitation');
const PasswordResetEmail = require('./email/list/passwordReset');
const EmailSender = require('./email');
const config = require('../config');
const helpers = require('../helpers');
const db = require('../db/models');

class Auth {
  static async signup(email, password, options = {}, host) {
    const user = await UsersDBApi.findBy({ email });

    const hashedPassword = await bcrypt.hash(
      password,
      config.bcrypt.saltRounds,
    );

    if (user) throw new ValidationError('auth.emailAlreadyInUse');

    const newUser = await UsersDBApi.createFromAuth(
      {
        firstName: email.split('@')[0],
        password: hashedPassword,
        email: email,
      },
      options,
    );

    if (EmailSender.isConfigured) {
      await this.sendEmailAddressVerificationEmail(newUser.email, host);
    }

    const data = {
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    };

    return helpers.jwtSign(data);
  }

  static async signin(email, password, options = {}) {
    const user = await UsersDBApi.findBy({ email });

    if (!user) {
      throw new ValidationError('auth.userNotFound');
    }

    if (user.disabled) {
      throw new ValidationError('auth.userDisabled');
    }

    if (!user.password) {
      throw new ValidationError('auth.wrongPassword');
    }

    if (process.env.NODE_ENV !== 'production' && !EmailSender.isConfigured) {
      user.emailVerified = true;
    }

    if (!user.emailVerified) {
      throw new ValidationError('auth.userNotVerified');
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      throw new ValidationError('auth.wrongPassword');
    }

    const data = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    return helpers.jwtSign(data);
  }

  static async sendEmailAddressVerificationEmail(email, host) {
    let link;
    try {
      const token = await UsersDBApi.generateEmailVerificationToken(email);
      link = `${config.uiOrigin}/verify-email?token=${encodeURIComponent(token)}`;
    } catch (error) {
      console.error(error);
      throw new ValidationError('auth.emailAddressVerificationEmail.error');
    }

    const emailAddressVerificationEmail = new EmailAddressVerificationEmail(
      email,
      link,
    );

    return new EmailSender(emailAddressVerificationEmail).send();
  }

  static async sendPasswordResetEmail(email, type = 'register', host) {
    let link;

    try {
      const token = await UsersDBApi.generatePasswordResetToken(email);
      link = `${config.uiOrigin}/password-reset?token=${encodeURIComponent(token)}`;
    } catch (error) {
      console.error(error);
      throw new ValidationError('auth.passwordReset.error');
    }

    let passwordResetEmail;
    if (type === 'register') {
      passwordResetEmail = new PasswordResetEmail(email, link);
    }
    if (type === 'invitation') {
      passwordResetEmail = new InvitationEmail(email, link);
    }

    return new EmailSender(passwordResetEmail).send();
  }

  static async verifyEmail(token, options = {}) {
    const user = await UsersDBApi.findByEmailVerificationToken(token, options);

    if (!user) {
      throw new ValidationError(
        'auth.emailAddressVerificationEmail.invalidToken',
      );
    }

    return UsersDBApi.markEmailVerified(user.id, options);
  }

  static async passwordUpdate(currentPassword, newPassword, options) {
    const currentUser = options.currentUser || null;
    if (!currentUser) {
      throw new ForbiddenError();
    }

    const currentPasswordMatch = await bcrypt.compare(
      currentPassword,
      currentUser.password,
    );

    if (!currentPasswordMatch) {
      throw new ValidationError('auth.wrongPassword');
    }

    const newPasswordMatch = await bcrypt.compare(
      newPassword,
      currentUser.password,
    );

    if (newPasswordMatch) {
      throw new ValidationError('auth.passwordUpdate.samePassword');
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      config.bcrypt.saltRounds,
    );

    return UsersDBApi.updatePassword(currentUser.id, hashedPassword, options);
  }

  static async passwordReset(token, password, options = {}) {
    const user = await UsersDBApi.findByPasswordResetToken(token, options);

    if (!user) {
      throw new ValidationError('auth.passwordReset.invalidToken');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      config.bcrypt.saltRounds,
    );

    return UsersDBApi.updatePassword(user.id, hashedPassword, options);
  }

  static async updateProfile(data, currentUser) {
    if (!currentUser?.id || !data || typeof data !== 'object' || Array.isArray(data)) throw new ForbiddenError();
    const allowed = ['firstName', 'lastName', 'phoneNumber'];
    if (Object.keys(data).some(key => !allowed.includes(key))) throw new ForbiddenError();
    const changes = {};
    for (const key of allowed) {
      if (data[key] !== undefined) {
        if (typeof data[key] !== 'string' || data[key].length > 150) throw new ValidationError('errors.validation.message');
        changes[key] = data[key].trim();
      }
    }
    return db.users.update(changes, {where:{id:currentUser.id}});
  }

}

module.exports = Auth;
