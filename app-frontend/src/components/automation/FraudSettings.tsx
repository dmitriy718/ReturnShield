import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { updateFraudSettings, type FraudSettings as FraudSettingsType } from '../../services/api';
import { useAuth } from '../../providers/AuthProvider';
import { ShieldAlert } from 'lucide-react';

interface FraudSettingsProps {
    settings: FraudSettingsType;
    onUpdate: () => void;
}

export const FraudSettings: React.FC<FraudSettingsProps> = ({ settings, onUpdate }) => {
    const { token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(settings);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        try {
            await updateFraudSettings(token, formData);
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error('Failed to update fraud settings', error);
        }
    };

    return (
        <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="text-red-500 w-6 h-6" />
                    <h3 className="text-xl font-bold text-gray-800">Fraud Detection</h3>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Edit Settings
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                        <label className="text-gray-700 font-medium">Flag High Velocity Returns</label>
                        <input
                            type="checkbox"
                            checked={formData.flag_high_velocity}
                            onChange={e => setFormData({ ...formData, flag_high_velocity: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded"
                        />
                    </div>

                    {formData.flag_high_velocity && (
                        <div className="ml-8">
                            <label className="block text-sm text-gray-600 mb-1">Max Returns per 30 Days</label>
                            <input
                                type="number"
                                value={formData.max_return_velocity}
                                onChange={e => setFormData({ ...formData, max_return_velocity: parseInt(e.target.value) })}
                                className="w-full p-2 border rounded-md"
                                min="1"
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                        <label className="text-gray-700 font-medium">Flag High Value Returns</label>
                        <input
                            type="checkbox"
                            checked={formData.flag_high_value}
                            onChange={e => setFormData({ ...formData, flag_high_value: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded"
                        />
                    </div>

                    {formData.flag_high_value && (
                        <div className="ml-8">
                            <label className="block text-sm text-gray-600 mb-1">High Value Threshold ($)</label>
                            <input
                                type="number"
                                value={formData.high_value_threshold}
                                onChange={e => setFormData({ ...formData, high_value_threshold: parseFloat(e.target.value) })}
                                className="w-full p-2 border rounded-md"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    )}

                    <div className="flex gap-2 justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData(settings);
                                setIsEditing(false);
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">High Velocity Check</span>
                        <span className={`font-medium ${settings.flag_high_velocity ? 'text-green-600' : 'text-gray-400'}`}>
                            {settings.flag_high_velocity ? `Enabled (> ${settings.max_return_velocity}/mo)` : 'Disabled'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">High Value Check</span>
                        <span className={`font-medium ${settings.flag_high_value ? 'text-green-600' : 'text-gray-400'}`}>
                            {settings.flag_high_value ? `Enabled (> $${settings.high_value_threshold})` : 'Disabled'}
                        </span>
                    </div>
                </div>
            )}
        </GlassCard>
    );
};
