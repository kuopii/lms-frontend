export const autoResizeTextarea = (e: React.FormEvent<HTMLTextAreaElement>) => {
  const target = e.target as HTMLTextAreaElement;
  target.style.height = "auto";
  target.style.height = target.scrollHeight + "px";
};
