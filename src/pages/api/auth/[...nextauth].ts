import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { query as q } from 'faunadb'
import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user'
    }),
  ],
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {

      console.log(user);

      try {
        await fauna.query(
          q.Create(
            q.Collection('users'),
            { data: { email } }
          )
        )

        return true
      } catch {
        return false
      }

      return true;
    },
  }
})