import crypto from 'crypto';
import fs from 'node:fs/promises';

(async function() {
  const keyPair = await Promise.resolve(crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  }));

  await fs.writeFile('private_key.pem', keyPair.privateKey);
  await fs.writeFile('public_key.pem', keyPair.publicKey);
  
})();
