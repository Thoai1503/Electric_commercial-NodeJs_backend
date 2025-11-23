declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: string;
    MONGO_URI?: string;
    DB?: string;
    DB_PORT?: string;
    DB_SERVER?: string;
    USER?: string;
    PASSWORD?: string;
    CATALOG_API_ENDPOINT?: string;
    CATALOG_API_ENDPOINT_TEST?: string;
    JWT_SECRET?: string;
    JWT_EXPIRE?: string;
    JWT_REFRESH_SECRET?: string;
    JWT_COOKIE_EXPIRE?: string;
    JWT_REFRESH_EXPIRE?: string;
    vnp_TmnCode?: string;
    vnp_HashSecret?: string;
    vnp_Url?: string;
    vnp_ReturnUrl?: string;
    momo_PartnerCode?: string;
    momo_AccessKey?: string;
    momo_SecretKey?: string;
    momo_RedirectUrl?: string;
    momo_IpnUrl?: string;
    momo_Endpoint?: string;
  }
}







