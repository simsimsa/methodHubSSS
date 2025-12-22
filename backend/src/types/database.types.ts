export interface User {
  id: number;
  name: string;
  passwordHash: string;
  email: string;
  isAdmin: boolean;
  isBanned: boolean;
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

export interface Material {
  id: number;
  title: string;
  description?: string;
  text?: string;
  author: string;
  category: number;
  theme: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Favorit {
  materialId: number;
  userId: number;
}

export interface CategoryWithTheme extends Category {
  themeDetails: Theme;
}

export interface MaterialWithDetails extends Material {
  categoryDetails: CategoryWithTheme;
  themeDetails: Theme;
}

export interface MaterialWithFavorites extends MaterialWithDetails {
  isFavorite?: boolean;
}

export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}
