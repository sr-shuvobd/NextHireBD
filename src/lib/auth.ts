import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import clientPromise from './mongodb';

const client = await clientPromise;
const db = client.db('nexthirebd');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'seeker',
        input: true,
      },
      avatar: {
        type: 'string',
        required: false,
        input: true,
      },
      companyName: {
        type: 'string',
        required: false,
        input: true,
      },
      companyWebsite: {
        type: 'string',
        required: false,
        input: true,
      },
      bio: {
        type: 'string',
        required: false,
        input: true,
      },
      title: {
        type: 'string',
        required: false,
        input: true,
      },
      skills: {
        type: 'string',
        required: false,
        input: true,
      },
      resumeUrl: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },
});
