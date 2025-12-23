import { useState } from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import { Settings, BookOpen, Tag, Users } from "lucide-react";
import AdminThemes from "../components/admin/AdminThemes";
import AdminCategories from "../components/admin/AdminCategories";
import AdminUsers from "../components/admin/AdminUsers";

type Tab = "themes" | "categories" | "users";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("themes");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "themes", label: "Темы", icon: <BookOpen className="h-5 w-5" /> },
    { id: "categories", label: "Категории", icon: <Tag className="h-5 w-5" /> },
    { id: "users", label: "Пользователи", icon: <Users className="h-5 w-5" /> },
  ];

  return (
    <ProtectedRoute requireAdmin>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Админ-панель</h1>
              <p className="text-gray-600 mt-1">
                Управление содержимым системы
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "themes" && <AdminThemes />}
              {activeTab === "categories" && <AdminCategories />}
              {activeTab === "users" && <AdminUsers />}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
