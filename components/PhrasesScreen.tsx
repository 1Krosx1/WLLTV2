import React from 'react';
import Header from './Header';
import { Activity, ActivityCategory } from '../types';

interface PhrasesScreenProps {
    categories: Activity[];
    onCategoryClick: (category: ActivityCategory) => void;
    onBack: () => void;
}

const CategoryCard: React.FC<{ category: Activity; onClick: () => void }> = ({ category, onClick }) => {
    const colorClasses: Partial<Record<ActivityCategory, string>> = {
        [ActivityCategory.Actions]: 'bg-cyan-400',
        [ActivityCategory.Animals]: 'bg-purple-600',
        [ActivityCategory.Values]: 'bg-orange-400',
        [ActivityCategory.Greetings]: 'bg-green-500',
        [ActivityCategory.Phrases]: 'bg-blue-600',
        [ActivityCategory.Food]: 'bg-red-600',
    };
    const color = colorClasses[category.id] || 'bg-gray-500';

    return (
        <button onClick={onClick} className={`${color} rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center aspect-square transition-transform transform active:scale-95`}>
            <div className="text-6xl mb-4">{category.icon}</div>
            <h2 className="text-white text-3xl font-bold">{category.title}</h2>
        </button>
    );
};

const PhrasesScreen: React.FC<PhrasesScreenProps> = ({ categories, onCategoryClick, onBack }) => {
    return (
        <div className="p-4">
            <Header title="Phrases" onBack={onBack} />
            <div className="mt-8 grid grid-cols-1 gap-6">
                {categories.map(cat => (
                    <CategoryCard key={cat.id} category={cat} onClick={() => onCategoryClick(cat.id)} />
                ))}
            </div>
        </div>
    );
};

export default PhrasesScreen;
