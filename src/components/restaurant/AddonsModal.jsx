import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { restaurantApi } from '../../services/restaurantApi';
import { formatPrice } from '../../utils/formatPrice';
import Button from '../common/Button';

const AddonsModal = ({ isOpen, onClose, menuItem, onAdd }) => {
    const [addonsData, setAddonsData] = useState({ required: [], optional: [] });
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && menuItem) {
            const fetchAddons = async () => {
                setLoading(true);
                try {
                    const data = await restaurantApi.getAddons(menuItem.id);
                    setAddonsData(data);
                    // Pre-select defaults if any (e.g. first required if multi-select not needed)
                } catch (error) {
                    console.error("Failed to fetch addons:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAddons();
        }
    }, [isOpen, menuItem]);

    const toggleAddon = (addon, isRequired) => {
        if (isRequired) {
            // For required, usually it's "pick one" per group in some systems, 
            // but let's assume it's just a multi-choice for now or follow backend rules if provided.
            // If the backend data had groups, we'd handle it. Here it's flat required/optional.

            const exists = selectedAddons.find(a => a.id === addon.id);
            if (exists) {
                setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
            } else {
                setSelectedAddons([...selectedAddons, addon]);
            }
        } else {
            const exists = selectedAddons.find(a => a.id === addon.id);
            if (exists) {
                setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
            } else {
                setSelectedAddons([...selectedAddons, addon]);
            }
        }
    };

    const isAllRequiredSelected = () => {
        // Simple logic: if there are required addons, at least one must be selected? 
        // Or specific count? Backend usually defines this. 
        // Let's assume for now that if required list is not empty, you must pick at least one.
        if (addonsData.required.length > 0) {
            const requiredSelected = selectedAddons.filter(a =>
                addonsData.required.some(r => r.id === a.id)
            );
            return requiredSelected.length > 0;
        }
        return true;
    };

    const handleConfirm = () => {
        onAdd(selectedAddons);
        onClose();
        setSelectedAddons([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up sm:animate-fade-in shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{menuItem.name}</h3>
                        <p className="text-sm text-gray-500">Customize your order</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-6 space-y-8">
                    {loading ? (
                        <div className="py-12 flex justify-center">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {addonsData.required.length > 0 && (
                                <section>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-gray-900">Required Options</h4>
                                        <span className="text-[10px] px-2 py-1 bg-red-50 text-red-600 font-black rounded uppercase">Selection Required</span>
                                    </div>
                                    <div className="space-y-3">
                                        {addonsData.required.map(addon => (
                                            <div
                                                key={addon.id}
                                                onClick={() => toggleAddon(addon, true)}
                                                className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedAddons.find(a => a.id === addon.id)
                                                        ? 'border-orange-500 bg-orange-50/30'
                                                        : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {selectedAddons.find(a => a.id === addon.id) ? (
                                                        <CheckCircle2 size={20} className="text-orange-500" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                                    )}
                                                    <span className="font-medium text-gray-700">{addon.name}</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">+{formatPrice(addon.price)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {addonsData.optional.length > 0 && (
                                <section>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-gray-900">Add-ons (Optional)</h4>
                                        <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-500 font-black rounded uppercase text-xs">Optional</span>
                                    </div>
                                    <div className="space-y-3">
                                        {addonsData.optional.map(addon => (
                                            <div
                                                key={addon.id}
                                                onClick={() => toggleAddon(addon, false)}
                                                className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedAddons.find(a => a.id === addon.id)
                                                        ? 'border-orange-500 bg-orange-50/30'
                                                        : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {selectedAddons.find(a => a.id === addon.id) ? (
                                                        <CheckCircle2 size={20} className="text-orange-500" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                                    )}
                                                    <span className="font-medium text-gray-700">{addon.name}</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">+{formatPrice(addon.price)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <Button
                        variant="primary"
                        fullWidth
                        disabled={!isAllRequiredSelected()}
                        onClick={handleConfirm}
                        className="py-4 text-lg font-black"
                    >
                        Add Item to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddonsModal;
