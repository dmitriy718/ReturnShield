import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { createAutomationRule, deleteAutomationRule, type AutomationRule } from '../../services/api';
import { useAuth } from '../../providers/AuthProvider';
import { Trash2, Plus } from 'lucide-react';

interface AutomationRulesProps {
    rules: AutomationRule[];
    onUpdate: () => void;
}

export const AutomationRules: React.FC<AutomationRulesProps> = ({ rules, onUpdate }) => {
    const { token } = useAuth();
    const [isCreating, setIsCreating] = useState(false);
    const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
        rule_type: 'FLAG',
        trigger_field: 'TOTAL_VALUE',
        operator: 'gt',
        value: '',
        is_active: true,
        name: ''
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        try {
            await createAutomationRule(token, newRule as Omit<AutomationRule, 'id'>);
            setIsCreating(false);
            setNewRule({
                rule_type: 'FLAG',
                trigger_field: 'TOTAL_VALUE',
                operator: 'gt',
                value: '',
                is_active: true,
                name: ''
            });
            onUpdate();
        } catch (error) {
            console.error('Failed to create rule', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!token || !confirm('Are you sure you want to delete this rule?')) return;
        try {
            await deleteAutomationRule(token, id);
            onUpdate();
        } catch (error) {
            console.error('Failed to delete rule', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-foreground">Automation Rules</h3>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus size={16} />
                    New Rule
                </button>
            </div>

            {isCreating && (
                <GlassCard className="p-6 mb-6">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Rule Name</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 bg-background border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                value={newRule.name}
                                onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                                placeholder="e.g. Auto-Approve Low Value"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">If...</label>
                                <select
                                    className="w-full p-2 bg-background border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                    value={newRule.trigger_field}
                                    onChange={e => setNewRule({ ...newRule, trigger_field: e.target.value as AutomationRule['trigger_field'] })}
                                >
                                    <option value="TOTAL_VALUE">Total Value</option>
                                    <option value="RETURN_REASON">Return Reason</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Operator</label>
                                <select
                                    className="w-full p-2 bg-background border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                    value={newRule.operator}
                                    onChange={e => setNewRule({ ...newRule, operator: e.target.value as AutomationRule['operator'] })}
                                >
                                    <option value="eq">Equals</option>
                                    <option value="gt">Greater Than</option>
                                    <option value="lt">Less Than</option>
                                    <option value="contains">Contains</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Value</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 bg-background border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                value={newRule.value}
                                onChange={e => setNewRule({ ...newRule, value: e.target.value })}
                                placeholder="e.g. 100 or 'Damaged'"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Then...</label>
                            <select
                                className="w-full p-2 bg-background border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                value={newRule.rule_type}
                                onChange={e => setNewRule({ ...newRule, rule_type: e.target.value as AutomationRule['rule_type'] })}
                            >
                                <option value="APPROVE">Auto-Approve</option>
                                <option value="REJECT">Auto-Reject</option>
                                <option value="FLAG">Flag for Review</option>
                            </select>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20"
                            >
                                Save Rule
                            </button>
                        </div>
                    </form>
                </GlassCard>
            )}

            <div className="space-y-4">
                {rules.map(rule => (
                    <GlassCard key={rule.id} className="p-4 flex justify-between items-center">
                        <div>
                            <div className="font-bold text-foreground">{rule.name}</div>
                            <div className="text-sm text-muted-foreground">
                                If {rule.trigger_field} {rule.operator} "{rule.value}" → <span className={`font-semibold ${
                                    rule.rule_type === 'APPROVE' ? 'text-green-400' : 
                                    rule.rule_type === 'REJECT' ? 'text-red-400' : 'text-yellow-400'
                                }`}>{rule.rule_type}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(rule.id)}
                            className="text-destructive/70 hover:text-destructive p-2 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </GlassCard>
                ))}
                {rules.length === 0 && (
                    <div className="text-center text-muted-foreground py-8 border border-dashed border-border/50 rounded-xl">
                        No automation rules configured.
                    </div>
                )}
            </div>
        </div>
    );
};