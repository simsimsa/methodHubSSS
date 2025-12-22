import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchFavorites, toggleFavorite } from "../store/materialsSlice";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { Heart, Calendar, User } from "lucide-react";

export default function Favorites() {
  const dispatch = useAppDispatch();
  const { favorites, isLoading } = useAppSelector((state) => state.materials);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleToggleFavorite = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(toggleFavorite(id)).unwrap();
      dispatch(fetchFavorites());
    } catch (error: any) {
      toast.error(error || "Ошибка");
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Избранные материалы
            </h1>
            <p className="text-gray-600 mt-1">
              Ваши сохраненные методические материалы
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Загрузка избранного...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                У вас пока нет избранных материалов
              </p>
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-700 font-medium inline-block"
              >
                Найти материалы
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((material) => (
                <Link
                  key={material.id}
                  to={`/materials/${material.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {material.title}
                    </h3>
                    <button
                      onClick={(e) => handleToggleFavorite(material.id, e)}
                      className="p-1.5 rounded-md transition-colors flex-shrink-0 ml-2 text-red-600 bg-red-50"
                      title="Удалить из избранного"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
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
    </ProtectedRoute>
  );
}
