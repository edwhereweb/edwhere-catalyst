import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LabFilters } from '@/types/gamification';

export const defaultLabFilters: LabFilters = {
  maxHours: 20,
  difficulties: [],
  fields: [],
  jobRoles: [],
};

const labFiltersSlice = createSlice({
  name: 'labFilters',
  initialState: defaultLabFilters,
  reducers: {
    setLabFilters: (_state, action: PayloadAction<LabFilters>) => action.payload,
    clearLabFilters: () => defaultLabFilters,
  },
});

export const { setLabFilters, clearLabFilters } = labFiltersSlice.actions;
export default labFiltersSlice.reducer;
