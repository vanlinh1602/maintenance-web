export const BACKEND =
  import.meta.env.REACT_APP_STAGE === 'development'
    ? 'http://localhost:3100'
    : 'https://be-maintenance.kuma.id.vn';
