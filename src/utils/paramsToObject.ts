export const paramsToObject = (sp: URLSearchParams) =>
  Array.from(sp.entries()).reduce<Record<string, string>>((acc, [k, v]) => {
    if (v != null && String(v).trim() !== "") acc[k] = v;
    return acc;
  }, {});
