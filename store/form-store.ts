import { create } from "zustand";

type FormStore = {
  triggerSubmit: () => void;
  setTrigger: (fn: () => void) => void;
};

export const useFormStore = create<FormStore>((set) => ({
  triggerSubmit: () => {},
  setTrigger: (fn) => set({ triggerSubmit: fn }),
}));
