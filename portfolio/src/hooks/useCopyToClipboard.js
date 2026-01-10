import { useState } from 'react';

// Copy to clipboard hook
function useCopyToClipboard() {
  const [copiedId, setCopiedId] = useState(null);

  const copy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Silently handle clipboard errors
    }
  };

  return { copiedId, copy };
}

export default useCopyToClipboard;
