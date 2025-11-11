import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const AIFormField = ({
  label,
  name,
  children,
  onFocus,
  onBlur,
  onAIAssist,
  isAIAssistantActive,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      {/* ▼▼▼ LA CORRECTION EST ICI ▼▼▼ */}
      {/* On ajoute un conteneur 'relative' autour du champ et du bouton */}
      <div className="relative w-full" onFocus={onFocus} onBlur={onBlur}>
        {children}

        {isAIAssistantActive && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            // Empêche le champ de perdre le focus quand on clique sur ce bouton
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onAIAssist(name, label)}
            // On positionne le bouton à l'intérieur à droite
            className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-10"
            title={`Obtenir de l'aide de l'IA pour "${label}"`}
          >
            <Sparkles className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default AIFormField;
