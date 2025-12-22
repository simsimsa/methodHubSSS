import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchMaterials, toggleFavorite } from "../store/materialsSlice";
import { api } from "../helpers/API";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { Heart, Search, BookOpen, Calendar, User } from "lucide-react";
import type { Theme, Category } from "../interfaces";

export default function Home() {
  const dispatch = useAppDispatch();
  const { materials, isLoading } = useAppSelector((state) => state.materials);
  const { user } = useAppSelector((state) => state.auth);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchMaterials());
    loadThemes();
  }, [dispatch]);

  useEffect(() => {
    if (selectedTheme) {
      loadCategories(selectedTheme);
    } else {
      setCategories([]);
    }
  }, [selectedTheme]);

  useEffect(() => {
    if (selectedTheme || selectedCategory) {
      loadFilteredMaterials();
    } else {
      dispatch(fetchMaterials());
    }
  }, [selectedTheme, selectedCategory, dispatch]);

  const loadThemes = async () => {
    try {
      const data = await api.getThemes();
      setThemes(data);
    } catch (error) {
      console.error("Ошибка загрузки тем:", error);
    }
  };

  const loadCategories = async (themeId: number) => {
    try {
      const data = await api.getCategoriesByTheme(themeId);
      setCategories(data);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    }
  };

  const loadFilteredMaterials = async () => {
    try {
      let data;
      if (selectedCategory) {
        data = await api.getMaterialsByCategory(selectedCategory);
      } else if (selectedTheme) {
        data = await api.getMaterialsByTheme(selectedTheme);
      } else {
        data = await api.getMaterials();
      }
      dispatch({ type: "materials/fetchAll/fulfilled", payload: data });
    } catch (error) {
      console.error("Ошибка загрузки материалов:", error);
    }
  };

  const handleToggleFavorite = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info("Войдите, чтобы добавить в избранное");
      return;
    }
    try {
      await dispatch(toggleFavorite(id)).unwrap();
    } catch (error: any) {
      toast.error(error || "Ошибка");
    }
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      searchQuery === "" ||
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Методические материалы
            </h1>
            <p className="text-gray-600 mt-1">
              Найдите нужные материалы для ваших уроков
            </p>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по названию, описанию или автору..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тема
              </label>
              <select
                value={selectedTheme || ""}
                onChange={(e) => {
                  setSelectedTheme(
                    e.target.value ? Number(e.target.value) : null,
                  );
                  setSelectedCategory(null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Все темы</option>
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <select
                value={selectedCategory || ""}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                disabled={!selectedTheme}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Все категории</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Материалы */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Загрузка материалов...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Материалы не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <Link
                key={material.id}
                to={`/materials/${material.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {material.title}
                  </h3>
                  {user && (
                    <button
                      onClick={(e) => handleToggleFavorite(material.id, e)}
                      className={`p-1.5 rounded-md transition-colors flex-shrink-0 ml-2 ${
                        material.isFavorite
                          ? "text-red-600 bg-red-50"
                          : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${material.isFavorite ? "fill-current" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {material.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {material.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded">
                    {material.themeDetails.name}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded">
                    {material.categoryDetails.name}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{material.author}</span>
                  </div>
                  {material.createdAt && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(material.createdAt).toLocaleDateString(
                          "ru-RU",
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
