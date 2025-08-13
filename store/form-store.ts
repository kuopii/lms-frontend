import { create } from "zustand";

type FormStore = {
  title: string;
  triggerSubmit: () => void;
  setTrigger: (fn: () => void) => void;
  setTitle: (title: string) => void;
};

export const useFormStore = create<FormStore>((set) => ({
  title: "Create a New Test",
  triggerSubmit: () => {},
  setTrigger: (fn) => set({ triggerSubmit: fn }),
  setTitle: (title) => set({ title }),
}));
