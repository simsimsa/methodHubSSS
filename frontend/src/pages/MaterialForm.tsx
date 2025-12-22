import { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  createMaterial,
  updateMaterial,
  fetchMaterial,
} from "../store/materialsSlice";
import { api } from "../helpers/API";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { ArrowLeft } from "lucide-react";
import type { Theme, Category } from "../interfaces";

export default function MaterialForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentMaterial } = useAppSelector((state) => state.materials);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState<number | "">("");
  const [theme, setTheme] = useState<number | "">("");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadThemes();
    if (isEdit && id) {
      dispatch(fetchMaterial(Number(id)));
    }
  }, [id, isEdit, dispatch]);

  useEffect(() => {
    if (currentMaterial && isEdit) {
      setTitle(currentMaterial.title);
      setDescription(currentMaterial.description || "");
      setText(currentMaterial.text || "");
      setCategory(currentMaterial.category);
      setTheme(currentMaterial.theme);
      loadCategories(currentMaterial.theme);
    }
  }, [currentMaterial, isEdit]);

  useEffect(() => {
    if (theme) {
      loadCategories(Number(theme));
    } else {
      setCategories([]);
      setCategory("");
    }
  }, [theme]);

  const loadThemes = async () => {
    try {
      const data = await api.getThemes();
      setThemes(data);
    } catch (error) {
      console.log(error);
      toast.error("Ошибка загрузки тем");
    }
  };

  const loadCategories = async (themeId: number) => {
    try {
      const data = await api.getCategoriesByTheme(themeId);
      setCategories(data);
      if (isEdit && currentMaterial && currentMaterial.theme === themeId) {
        setCategory(currentMaterial.category);
      } else {
        setCategory("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Ошибка загрузки категорий");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !category || !theme) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        title,
        description: description || undefined,
        text: text || undefined,
        category: Number(category),
        theme: Number(theme),
      };

      if (isEdit && id) {
        await dispatch(updateMaterial({ id: Number(id), data })).unwrap();
        toast.success("Материал обновлен");
      } else {
        await dispatch(createMaterial(data)).unwrap();
        toast.success("Материал создан");
      }
      navigate("/");
    } catch (error: any) {
      toast.error(error || "Ошибка сохранения");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </button>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {isEdit ? "Редактировать материал" : "Создать новый материал"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Название <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Введите название материала"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Описание
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Краткое описание материала"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="theme"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Тема <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="theme"
                    value={theme}
                    onChange={(e) =>
                      setTheme(e.target.value ? Number(e.target.value) : "")
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Выберите тему</option>
                    {themes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Категория <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value ? Number(e.target.value) : "")
                    }
                    required
                    disabled={!theme}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Содержание (Markdown)
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={15}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                  placeholder="Введите содержимое материала в формате Markdown..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Поддерживается форматирование Markdown (заголовки, списки,
                  ссылки и т.д.)
                </p>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Сохранение..."
                    : isEdit
                      ? "Сохранить изменения"
                      : "Создать материал"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
