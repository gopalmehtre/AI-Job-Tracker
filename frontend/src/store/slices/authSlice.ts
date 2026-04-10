import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { AuthState, User } from "../../types";

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") ?? "null"),
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (
    data: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/auth/register", data);
      return res.data as { token: string; user: User };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message ?? "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    data: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/auth/login", data);
      return res.data as { token: string; user: User };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message ?? "Login failed"
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/me");
      return res.data as { user: User };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message ?? "Session expired"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
