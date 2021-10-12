declare namespace NodeJS {
  export interface ProcessEnv {
    SKILLWALLET_ADDRESS: string,
    DEV_PARTNER_KEY: string,
    PROD_PARTNER_KEY: string,
    SW_PARTNER_ENV: string
  }
}