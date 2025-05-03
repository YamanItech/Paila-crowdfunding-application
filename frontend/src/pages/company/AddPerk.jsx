import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPerk = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        benefit1: { name: '', description: '', price: '' },
        benefit2: { name: '', description: '', price: '' },
        benefit3: { name: '', description: '', price: '' }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (benefitKey, field, value) => {
        setFormData(prev => ({
            ...prev,
            [benefitKey]: {
                ...prev[benefitKey],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        const projectId = localStorage.getItem('projectId');

        const payload = {
            projectId: projectId,
            benefit1: [formData.benefit1],
            benefit2: [formData.benefit2],
            benefit3: [formData.benefit3]
        };


        try {
            const res = await fetch('http://localhost:8000/api/v1/project/addPerk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Success:', data);
                navigate('/company');
            } else {
                const errData = await res.json();
                setError(errData.message || 'Failed to submit');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-main-bg min-h-screen p-6">
            <div className="max-w-2xl mx-auto bg-header-bg rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-coral-700 mb-6">Add Perks</h1>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {["benefit1", "benefit2", "benefit3"].map(benefitKey => (
                        <div key={benefitKey} className="space-y-4">
                            <h2 className="text-xl font-semibold text-coral-800">
                                {benefitKey.replace("benefit", "Benefit ")}
                            </h2>
                            <div className="p-4 rounded-md border">
                                <label className="block text-lg font-medium text-coral-800">Benefit Name</label>
                                <input
                                    type="text"
                                    value={formData[benefitKey].name}
                                    onChange={(e) => handleChange(benefitKey, 'name', e.target.value)}
                                    className="w-full mb-2 px-4 py-3 bg-card-bg border border-card-alt-bg rounded-md focus:ring-2 focus:ring-coral-500 focus:outline-none"
                                />

                                <label className="block text-lg font-medium text-coral-800">Description</label>
                                <textarea
                                    value={formData[benefitKey].description}
                                    onChange={(e) => handleChange(benefitKey, 'description', e.target.value)}
                                    className="w-full mb-2 px-4 py-3 bg-card-bg border border-card-alt-bg rounded-md focus:ring-2 focus:ring-coral-500 focus:outline-none"
                                />

                                <label className="block text-lg font-medium text-coral-800">Price</label>
                                <input
                                    type="number"
                                    value={formData[benefitKey].price}
                                    onChange={(e) => handleChange(benefitKey, 'price', e.target.value)}
                                    className="w-full px-4 py-3 bg-card-bg border border-card-alt-bg rounded-md focus:ring-2 focus:ring-coral-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    ))}

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-coral hover:bg-coral-600 text-white font-bold py-3 px-6 rounded-md"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : 'Add Perks'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPerk;
