import * as bcryptjs from 'bcryptjs';

export class Hash {
  static generateHash(plainText: string) {
    return bcryptjs.hashSync(plainText, 10);
  }

  static compare(plainText: string, hash: string) {
    return bcryptjs.compareSync(plainText, hash);
  }
}
