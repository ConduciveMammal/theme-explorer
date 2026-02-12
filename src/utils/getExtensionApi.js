const getRuntimeRoot = () => {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof browser !== 'undefined') {
    return { browser };
  }

  if (typeof chrome !== 'undefined') {
    return { chrome };
  }

  return {};
};

const getExtensionApi = () => {
  const runtimeRoot = getRuntimeRoot();
  return runtimeRoot.browser || runtimeRoot.chrome || null;
};

export default getExtensionApi;
