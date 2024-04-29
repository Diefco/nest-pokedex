export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3000,
  defaultLimit: +process.env.DEFAULT_LIMIT || 7, // Se convierte a numero para no recibirlo como string desde .env
});
