import crypto from 'crypto'
import User from 'App/Models/User'

export default class AuthenticateByToken {
  public urlDecode(encoded: string) {
    return Buffer.from(encoded, 'base64').toString('utf-8')
  }

  public generateHash(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  public parseToken(token: string) {
    const parts = token.split('.')

    // Ensure the token has two parts
    if (parts.length !== 2) {
      throw new Error('E_INVALID_API_TOKEN')
    }

    // Ensure the first part is a base64 encode id
    const tokenId = this.urlDecode(parts[0])

    if (!tokenId) {
      return null
    }

    const parsedToken = this.generateHash(parts[1])

    return {
      token: parsedToken,
      tokenId,
    }
  }

  public async checkToken(token: string) {
    const parsedToken = this.parseToken(token)

    if (!parsedToken) {
      return null
    }

    return await User.query()
      .select('users.*')
      .leftJoin('api_tokens', 'users.id', 'api_tokens.user_id')
      .where('api_tokens.id', parsedToken.tokenId)
      .andWhere('token', parsedToken.token)
      .first()
  }

  public async authenticate(token: string) {
    if (!token || typeof token !== 'string') {
      return null
    }
    return await this.checkToken(token)
  }
}
