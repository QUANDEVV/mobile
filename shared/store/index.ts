import {create} from 'zustand';

const useStore = create((set) => ({
    tiers: [],
    setTiers: (tiers) => set({tiers}),
    getTiers: () => useStore.getState().tiers,
    selectedTier: null,
    setSelectedTier: (selectedTier) => set({selectedTier}),
    getSelectedTier: () => useStore.getState().selectedTier,
}));

export default useStore;