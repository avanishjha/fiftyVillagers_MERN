import React from 'react';
import { motion } from 'framer-motion';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({ message = "No items found", icon: Icon = FileQuestion, action }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700"
        >
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {message}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm">
                Get started by creating your first item.
            </p>
            {action && (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {action}
                </motion.div>
            )}
        </motion.div>
    );
};

export default EmptyState;
