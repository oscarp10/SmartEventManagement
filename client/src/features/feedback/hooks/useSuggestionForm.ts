import { useState } from "react";

export function useSuggestionForm() {
  const [suggestTitle, setSuggestTitle] = useState("");
  const [suggestDescription, setSuggestDescription] = useState("");
  const [suggestRationale, setSuggestRationale] = useState("");
  const [suggestStatus, setSuggestStatus] = useState("");
  const [suggestLoading, setSuggestLoading] = useState(false);

  return {
    suggestTitle,
    setSuggestTitle,
    suggestDescription,
    setSuggestDescription,
    suggestRationale,
    setSuggestRationale,
    suggestStatus,
    setSuggestStatus,
    suggestLoading,
    setSuggestLoading
  };
}

