self.onmessage = (e) => {
  const blob = e.data;
  self.postMessage(blob);
};
