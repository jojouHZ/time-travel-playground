export const getEnv = () => ({
  DB_NAME: import.meta.env.VITE_APP_DB_NAME || 'default_db_name',
  DB_VERSION: parseInt(import.meta.env.VITE_APP_DB_VERSION || '1'),
  STORE_NAME: import.meta.env.VITE_APP_STORE_NAME || 'default_store_name',
});
