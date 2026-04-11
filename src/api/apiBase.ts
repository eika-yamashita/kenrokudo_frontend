const getApiBase = () => {
  const configuredBase = process.env.REACT_APP_API_BASE?.trim();
  if (configuredBase) {
    return configuredBase.replace(/\/+$/, '');
  }

  return '';
};

export const API_BASE = getApiBase();
