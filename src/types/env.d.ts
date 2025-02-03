declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URI: string;
      PAYLOAD_SECRET: string;

      S3_BUCKET: string;
      S3_ACCESS_KEY_ID: string;
      S3_SECRET_ACCESS_KEY: string;
      S3_REGION: string;

      NEXT_PUBLIC_SERVER_URL: string;
      VERCEL_PROJECT_PRODUCTION_URL: string;
    }
  }
}

export {};
