import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../helpers/API";
import type {
  MaterialWithFavorites,
  CreateMaterialDto,
  UpdateMaterialDto,
} from "../interfaces";

interface MaterialsState {
  materials: MaterialWithFavorites[];
  favorites: MaterialWithFavorites[];
  currentMaterial: MaterialWithFavorites | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MaterialsState = {
  materials: [],
  favorites: [],
  currentMaterial: null,
  isLoading: false,
  error: null,
};

export const fetchMaterials = createAsyncThunk(
  "materials/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await api.getMaterials();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка загрузки материалов",
      );
    }
  },
);

export const fetchMaterial = createAsyncThunk(
  "materials/fetchOne",
  async (id: number, { rejectWithValue }) => {
    try {
      return await api.getMaterial(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка загрузки материала",
      );
    }
  },
);

export const fetchFavorites = createAsyncThunk(
  "materials/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      return await api.getFavorites();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка загрузки избранного",
      );
    }
  },
);

export const createMaterial = createAsyncThunk(
  "materials/create",
  async (data: CreateMaterialDto, { rejectWithValue }) => {
    try {
      return await api.createMaterial(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка создания материала",
      );
    }
  },
);

export const updateMaterial = createAsyncThunk(
  "materials/update",
  async (
    { id, data }: { id: number; data: UpdateMaterialDto },
    { rejectWithValue },
  ) => {
    try {
      return await api.updateMaterial(id, data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка обновления материала",
      );
    }
  },
);

export const deleteMaterial = createAsyncThunk(
  "materials/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.deleteMaterial(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка удаления материала",
      );
    }
  },
);

export const toggleFavorite = createAsyncThunk(
  "materials/toggleFavorite",
  async (id: number, { rejectWithValue }) => {
    try {
      return await api.toggleFavorite(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка изменения избранного",
      );
    }
  },
);

const materialsSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {
    clearCurrentMaterial: (state) => {
      state.currentMaterial = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Materials
      .addCase(fetchMaterials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.materials = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Material
      .addCase(fetchMaterial.fulfilled, (state, action) => {
        state.currentMaterial = action.payload;
      })
      // Fetch Favorites
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      // Create Material
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.materials.unshift(action.payload);
      })
      // Update Material
      .addCase(updateMaterial.fulfilled, (state, action) => {
        const index = state.materials.findIndex(
          (m) => m.id === action.payload.id,
        );
        if (index !== -1) {
          state.materials[index] = action.payload;
        }
        if (state.currentMaterial?.id === action.payload.id) {
          state.currentMaterial = action.payload;
        }
      })
      // Delete Material
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.materials = state.materials.filter(
          (m) => m.id !== action.payload,
        );
        if (state.currentMaterial?.id === action.payload) {
          state.currentMaterial = null;
        }
      })
      // Toggle Favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const material = state.materials.find((m) => m.id === action.meta.arg);
        if (material) {
          material.isFavorite = action.payload.isFavorite;
        }
        if (state.currentMaterial?.id === action.meta.arg) {
          state.currentMaterial.isFavorite = action.payload.isFavorite;
        }
      });
  },
});

export const { clearCurrentMaterial, clearError } = materialsSlice.actions;
export default materialsSlice.reducer;
