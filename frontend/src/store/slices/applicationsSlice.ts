import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Application, ApplicationsState, ApplicationStatus } from "../../types";

const initialState: ApplicationsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchApplications = createAsyncThunk(
  "applications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/applications");
      return res.data as Application[];
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message ?? "Failed to fetch applications"
      );
    }
  }
);

export const createApplication = createAsyncThunk(
  "applications/create",
  async (data: Partial<Application>, { rejectWithValue }) => {
    try {
      const res = await api.post("/applications", data);
      return res.data as Application;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message ?? "Failed to create application"
      );
    }
  }
);

export const updateApplication = createAsyncThunk(
  "applications/update",
  async (
    { id, data }: { id: string; data: Partial<Application> },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/applications/${id}`, data);
      return res.data as Application;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message ?? "Failed to update application"
      );
    }
  }
);

export const deleteApplication = createAsyncThunk(
  "applications/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/applications/${id}`);
      return id;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message ?? "Failed to delete application"
      );
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async (
    { id, status, order }: { id: string; status: ApplicationStatus; order: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.patch(`/applications/${id}/status`, { status, order });
      return res.data as Application;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message ?? "Failed to update status"
      );
    }
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    // Optimistic update for drag-and-drop
    moveApplication(
      state,
      action: {
        payload: { id: string; newStatus: ApplicationStatus; newOrder: number };
      }
    ) {
      const app = state.items.find((item) => item._id === action.payload.id);
      if (app) {
        app.status = action.payload.newStatus;
        app.order = action.payload.newOrder;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder.addCase(createApplication.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateApplication.fulfilled, (state, action) => {
      const idx = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (idx !== -1) state.items[idx] = action.payload;
    });

    builder.addCase(deleteApplication.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    });

    builder.addCase(updateApplicationStatus.fulfilled, (state, action) => {
      const idx = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (idx !== -1) state.items[idx] = action.payload;
    });
  },
});

export const { clearError, moveApplication } = applicationsSlice.actions;
export default applicationsSlice.reducer;
