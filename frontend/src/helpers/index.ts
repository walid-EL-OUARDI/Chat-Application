export const url = (urlPath: string): string => {
  return process.env.VUE_APP_BASE_URL + urlPath;
};
