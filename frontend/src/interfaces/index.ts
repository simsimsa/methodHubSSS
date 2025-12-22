export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  isBanned?: boolean;
}

export interface Theme {
  id: number;
  name: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  theme: number;
}

export interface CategoryWithTheme extends Category {
  themeDetails: Theme;
}

export interface Material {
  id: number;
  title: string;
  description?: string;
  text?: string;
  author: string;
  category: number;
  theme: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaterialWithDetails extends Material {
  categoryDetails: CategoryWithTheme;
  themeDetails: Theme;
}

export interface MaterialWithFavorites extends MaterialWithDetails {
  isFavorite?: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface CreateMaterialDto {
  title: string;
  description?: string;
  text?: string;
  category: number;
  theme: number;
}

export interface UpdateMaterialDto {
  title?: string;
  description?: string;
  text?: string;
  category?: number;
  theme?: number;
}

export interface CreateThemeDto {
  name: string;
  description?: string;
}

export interface UpdateThemeDto {
  name?: string;
  description?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  theme: number;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  theme?: number;
}

export interface UpdateUserDto {
  isAdmin?: boolean;
  isBanned?: boolean;
}
