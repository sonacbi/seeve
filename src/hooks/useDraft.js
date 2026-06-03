import { useRef } from "react";

export function useDraft() {
  const draftRef = useRef("");

  const setDraft = (v) => {
    draftRef.current = v;
  };

  const getDraft = () => draftRef.current;

  const clearDraft = () => {
    draftRef.current = "";
  };

  return { draftRef, setDraft, getDraft, clearDraft };
}