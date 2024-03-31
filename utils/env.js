// tiny wrapper with default env vars
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  SENTRY_AUTH_TOKEN: 'sntrys_eyJpYXQiOjE3MTE4OTM5NDAuMjU2NzgyLCJ1cmwiOiJodHRwczovL3NlbnRyeS5pbyIsInJlZ2lvbl91cmwiOiJodHRwczovL3VzLnNlbnRyeS5pbyIsIm9yZyI6Im1lcmx5bi1kZXNpZ24td29ya3MifQ'
};
