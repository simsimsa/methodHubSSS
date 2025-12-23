import axios from "axios";
import type { AxiosInstance } from "axios";

const PREFIX = import.meta.env.VITE_API_PREFIX || "http://localhost:3000";
import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  MaterialWithFavorites,
  CreateMaterialDto,
  UpdateMaterialDto,
  Theme,
  CreateThemeDto,
  UpdateThemeDto,
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  User,
  UpdateUserDto,
} from "../interfaces";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: PREFIX,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>(
      "/auth/register",
      data,
    );
    return response.data;
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/auth/login", data);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<User>("/auth/profile");
    return response.data;
  }

  async getMaterials(): Promise<MaterialWithFavorites[]> {
    const response =
      await this.client.get<MaterialWithFavorites[]>("/materials");
    return response.data;
  }

  async getMaterial(id: number): Promise<MaterialWithFavorites> {
    const response = await this.client.get<MaterialWithFavorites>(
      `/materials/${id}`,
    );
    return response.data;
  }

  async createMaterial(
    data: CreateMaterialDto,
  ): Promise<MaterialWithFavorites> {
    const response = await this.client.post<MaterialWithFavorites>(
      "/materials",
      data,
    );
    return response.data;
  }

  async updateMaterial(
    id: number,
    data: UpdateMaterialDto,
  ): Promise<MaterialWithFavorites> {
    const response = await this.client.patch<MaterialWithFavorites>(
      `/materials/${id}`,
      data,
    );
    return response.data;
  }

  async deleteMaterial(id: number): Promise<void> {
    await this.client.delete(`/materials/${id}`);
  }

  async toggleFavorite(id: number): Promise<{ isFavorite: boolean }> {
    const response = await this.client.post<{ isFavorite: boolean }>(
      `/materials/${id}/favorite`,
    );
    return response.data;
  }

  async getFavorites(): Promise<MaterialWithFavorites[]> {
    const response = await this.client.get<MaterialWithFavorites[]>(
      "/materials/favorites",
    );
    return response.data;
  }

  async getMaterialsByCategory(
    categoryId: number,
  ): Promise<MaterialWithFavorites[]> {
    const response = await this.client.get<MaterialWithFavorites[]>(
      `/materials/category/${categoryId}`,
    );
    return response.data;
  }

  async getMaterialsByTheme(themeId: number): Promise<MaterialWithFavorites[]> {
    const response = await this.client.get<MaterialWithFavorites[]>(
      `/materials/theme/${themeId}`,
    );
    return response.data;
  }

  async getThemes(): Promise<Theme[]> {
    const response = await this.client.get<Theme[]>("/themes");
    return response.data;
  }

  async getTheme(id: number): Promise<Theme> {
    const response = await this.client.get<Theme>(`/themes/${id}`);
    return response.data;
  }

  async createTheme(data: CreateThemeDto): Promise<Theme> {
    const response = await this.client.post<Theme>("/themes", data);
    return response.data;
  }

  async updateTheme(id: number, data: UpdateThemeDto): Promise<Theme> {
    const response = await this.client.patch<Theme>(`/themes/${id}`, data);
    return response.data;
  }

  async deleteTheme(id: number): Promise<void> {
    await this.client.delete(`/themes/${id}`);
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.client.get<Category[]>("/categories");
    return response.data;
  }

  async getCategory(id: number): Promise<Category> {
    const response = await this.client.get<Category>(`/categories/${id}`);
    return response.data;
  }

  async getCategoriesByTheme(themeId: number): Promise<Category[]> {
    const response = await this.client.get<Category[]>(
      `/categories/theme/${themeId}`,
    );
    return response.data;
  }

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const response = await this.client.post<Category>("/categories", data);
    return response.data;
  }

  async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    const response = await this.client.patch<Category>(
      `/categories/${id}`,
      data,
    );
    return response.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await this.client.delete(`/categories/${id}`);
  }

  async getUsers(): Promise<User[]> {
    const response = await this.client.get<User[]>("/users");
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await this.client.get<User>(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const response = await this.client.patch<User>(`/users/${id}`, data);
    return response.data;
  }
}

export const api = new ApiClient();
