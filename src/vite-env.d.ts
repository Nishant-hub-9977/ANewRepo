/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string

  readonly VITE_ANGELONE_TRADING_API_KEY: string
  readonly VITE_ANGELONE_MARKET_FEED_API_KEY: string
  readonly VITE_ANGELONE_HISTORICAL_API_KEY: string
  readonly VITE_ANGELONE_PUBLISHER_API_KEY: string

  readonly VITE_INDIAN_STOCK_API_SERVER: string
  readonly VITE_INDIAN_STOCK_API_KEY: string
  readonly VITE_INDIAN_STOCK_API_HEADER: string

  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_GOOGLE_CLOUD_API_KEY: string

  /** The base URL of your Flask API (deployed on Render) */
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
