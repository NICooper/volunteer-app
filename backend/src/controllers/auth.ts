import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { AccountModel } from '../models/accounts';
import { issueJWT } from '../services/jwt-auth';
import { User } from '../types/user';

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const accounts = await AccountModel.getAccount(req.body.email.toLowerCase());

    if (accounts.length === 0) {
      res.status(401).json({ message: 'Incorrect email or password.' });
      return;
    }

    const account = accounts[0];

    const hashedPassword = await new Promise<Buffer>((resolve, reject) => {
      crypto.pbkdf2(req.body.password, Buffer.from(account.salt, 'base64'), 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(hashedPassword);
        }
      });
    });

    if (!crypto.timingSafeEqual(Buffer.from(account.passwordHash, 'base64'), hashedPassword)) {
      res.status(401).json({ message: 'Incorrect email or password.' });
      return;
    }

    const orgAccount = await AccountModel.getOrgAccount(account.id);
    const userAccount = await AccountModel.getVolunteerAccount(account.id);

    let user: User;
    if (orgAccount.length !== 0) {
      user = { id: account.id, role: 'org' };
    }
    else if (userAccount.length !== 0) {
      user = { id: account.id, role: 'user' };
    }
    else {
      throw new Error();
    }

    return res.status(200).setHeader('Authorization', `Bearer ${issueJWT(user)}`).json({ message: 'Signed in successfully' });
  }
  catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
}

export async function signUpOrg(req: Request, res: Response, next: NextFunction) {
  let hashedPassword: string;
  let salt: string;
  try {
    ({ hashedPassword, salt } = await hashPassword(req.body.password));
  }
  catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  let orgId: number;
  try {
    orgId = await AccountModel.createOrgAccount(
      {
        email: req.body.email.toLowerCase(),
        passwordHash: hashedPassword,
        salt: salt
      },
      {
        name: req.body.name,
        profilePhotoUrl: req.body.profilePhotoUrl,
        address: req.body.address,
        website: req.body.website
      }
    );
  }
  catch (err) {
    res.status(409).json({ message: 'Error creating account' });
    return;
  }

  const user: User = { id: orgId, role: 'org' };

  return res.status(201).setHeader('Authorization', `Bearer ${issueJWT(user)}`).json({ message: 'Signed up successfully' });
}

export async function signUpUser(req: Request, res: Response, next: NextFunction) {
  let hashedPassword: string;
  let salt: string;
  try {
    ({ hashedPassword, salt } = await hashPassword(req.body.password));
  }
  catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  let id: number;
  try {
    id = await AccountModel.createUserAccount(
      {
        email: req.body.email.toLowerCase(),
        passwordHash: hashedPassword,
        salt: salt
      },
      {
        username: req.body.username,
        profilePhotoUrl: req.body.profilePhotoUrl
      }
    );
  }
  catch (err) {
    res.status(409).json({ message: 'Error creating account' });
    return;
  }

  const user: User = { id: id, role: 'user' };

  return res.status(201).setHeader('Authorization', `Bearer ${issueJWT(user)}`).json({ message: 'Signed up successfully' });
}

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(32);

  const hashedPassword = await new Promise<NonSharedBuffer>((resolve, reject) => {
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(hashedPassword);
      }
    })
  });

  return { hashedPassword: hashedPassword.toString('base64'), salt: salt.toString('base64') };
}
