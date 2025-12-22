import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchMaterial,
  toggleFavorite,
  deleteMaterial,
} from "../store/materialsSlice";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import {
  Heart,
  Edit,
  Trash2,
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function MaterialDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentMaterial, isLoading } = useAppSelector(
    (state) => state.materials,
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchMaterial(Number(id)));
    }
  }, [id, dispatch]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.info("Войдите, чтобы добавить в избранное");
      return;
    }
    if (!id) return;
    try {
      await dispatch(toggleFavorite(Number(id))).unwrap();
    } catch (error: any) {
      toast.error(error || "Ошибка");
    }
  };

  const handleDelete = async () => {
    if (!id || !currentMaterial) return;
    if (!window.confirm("Вы уверены, что хотите удалить этот материал?"))
      return;

    try {
      await dispatch(deleteMaterial(Number(id))).unwrap();
      toast.success("Материал удален");
      navigate("/");
    } catch (error: any) {
      toast.error(error || "Ошибка удаления");
    }
  };

  const canEdit =
    user &&
    currentMaterial &&
    (user.isAdmin || currentMaterial.author === user.name);
  const canDelete =
    user &&
    currentMaterial &&
    (user.isAdmin || currentMaterial.author === user.name);

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Загрузка материала...</p>
        </div>
      </Layout>
    );
  }

  if (!currentMaterial) {
    return (
      <Layout>
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Материал не найден</p>
          <Link
            to="/"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
          >
            Вернуться на главную
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к материалам
        </Link>

        <article className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {currentMaterial.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded">
                  {currentMaterial.themeDetails.name}
                </span>
                <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded">
                  {currentMaterial.categoryDetails.name}
                </span>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{currentMaterial.author}</span>
                </div>
                {currentMaterial.createdAt && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(currentMaterial.createdAt).toLocaleDateString(
                        "ru-RU",
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              {user && (
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-md transition-colors ${
                    currentMaterial.isFavorite
                      ? "text-red-600 bg-red-50"
                      : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                  }`}
                  title={
                    currentMaterial.isFavorite
                      ? "Удалить из избранного"
                      : "Добавить в избранное"
                  }
                >
                  <Heart
                    className={`h-5 w-5 ${currentMaterial.isFavorite ? "fill-current" : ""}`}
                  />
                </button>
              )}
              {canEdit && (
                <Link
                  to={`/materials/${id}/edit`}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Редактировать"
                >
                  <Edit className="h-5 w-5" />
                </Link>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {currentMaterial.description && (
            <div className="mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {currentMaterial.description}
              </p>
            </div>
          )}

          {currentMaterial.text && (
            <div className="prose max-w-none mt-8">
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Содержание
                </h2>
                <div className="markdown-content">
                  <ReactMarkdown>{currentMaterial.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
}
