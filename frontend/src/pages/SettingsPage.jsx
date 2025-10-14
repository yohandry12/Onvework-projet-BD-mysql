import React, { useState } from "react";
import {
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("compte");
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const sections = [
    { id: "compte", label: "Compte", icon: UserIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
    { id: "securite", label: "Sécurité", icon: ShieldCheckIcon },
    { id: "privacy", label: "Confidentialité", icon: EyeIcon },
    {
      id: "apparence",
      label: "Apparence",
      icon: theme === "light" ? SunIcon : MoonIcon,
    },
    { id: "langue", label: "Langue", icon: LanguageIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-gray-600 mt-1">
                  Gérez vos préférences et paramètres de compte
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation latérale */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1 bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              {/* Section Compte */}
              {activeSection === "compte" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Informations du compte
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Gérez vos informations personnelles
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Poste
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Votre poste"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      Photo de profil
                    </h3>
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                        JD
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                          Changer
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Notifications */}
              {activeSection === "notifications" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Préférences de notifications
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Contrôlez comment et quand vous recevez des notifications
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        id: "email",
                        label: "Email",
                        description: "Recevoir des notifications par email",
                      },
                      {
                        id: "push",
                        label: "Notifications push",
                        description: "Notifications sur votre appareil",
                      },
                      {
                        id: "sms",
                        label: "SMS",
                        description: "Recevoir des alertes par SMS",
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.label}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.id]}
                            onChange={(e) =>
                              setNotifications((prev) => ({
                                ...prev,
                                [item.id]: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section Apparence */}
              {activeSection === "apparence" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Apparence
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Personnalisez l'apparence de l'application
                    </p>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      Thème
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "light", label: "Clair", icon: SunIcon },
                        { id: "dark", label: "Sombre", icon: MoonIcon },
                        {
                          id: "auto",
                          label: "Auto",
                          icon: DevicePhoneMobileIcon,
                        },
                      ].map((themeOption) => {
                        const Icon = themeOption.icon;
                        return (
                          <button
                            key={themeOption.id}
                            onClick={() => setTheme(themeOption.id)}
                            className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                              theme === themeOption.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <Icon className="w-6 h-6 mb-2 text-gray-600" />
                            <div className="font-medium text-gray-900">
                              {themeOption.label}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {themeOption.id === "auto"
                                ? "Basé sur vos préférences système"
                                : themeOption.id === "light"
                                ? "Interface claire"
                                : "Interface sombre"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Section Sécurité */}
              {activeSection === "securite" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Sécurité
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Protégez votre compte et vos données
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Authentification à deux facteurs
                          </h3>
                          <p className="text-sm text-gray-600">
                            Ajoutez une couche de sécurité supplémentaire
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        Activer
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <CreditCardIcon className="w-6 h-6 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Changer le mot de passe
                          </h3>
                          <p className="text-sm text-gray-600">
                            Mettez à jour votre mot de passe régulièrement
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Modifier
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-4">
                        <TrashIcon className="w-6 h-6 text-red-600" />
                        <div>
                          <h3 className="font-medium text-red-900">
                            Supprimer le compte
                          </h3>
                          <p className="text-sm text-red-700">
                            Cette action est irréversible
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Autres sections... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
