export const isExternalReferrer = () => {
  if (!document.referrer) return false;
  try {
    const refHost = new URL(document.referrer).host;
    return refHost !== window.location.host;
  } catch {
    return false;
  }
};
