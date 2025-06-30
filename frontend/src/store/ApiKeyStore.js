import { create } from "zustand";

export const useApiKeyStore = create((set) => ({
  // Dialog visibility
  isGenerateOpen: false,
  isRevokeOpen: false,
  isDisplayOpen: false,

  // UI + API state
  name: "",
  apiKey: "", // freshly created key
  selectedKeyId: null, // for revocation
  loading: false,

  openGenerate: () => set({ isGenerateOpen: true }),
  closeGenerate: () =>
    set({ isGenerateOpen: false, name: "", apiKey: "", loading: false }),

  openDisplay: (apiKey) => set({ isDisplayOpen: true, apiKey }),
  closeDisplay: () => set({ isDisplayOpen: false, apiKey: "" }),

  openRevoke: (keyId) => set({ isRevokeOpen: true, selectedKeyId: keyId }),
  closeRevoke: () => set({ isRevokeOpen: false, selectedKeyId: null }),

  //state updates
  setName: (name) => set({ name }),
  setApiKey: (apiKey) => set({ apiKey }),
  setLoading: (loading) => set({ loading }),

  //reset all
  resetAll: () =>
    set({
      isGenerateOpen: false,
      isRevokeOpen: false,
      name: "",
      apiKey: "",
      selectedKeyId: null,
      loading: false,
    }),
}));
