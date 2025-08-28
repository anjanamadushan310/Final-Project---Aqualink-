import React from 'react';

const ActionButtons = ({ onCancel, onSave, loading }) => (
    <div className="flex justify-end space-x-4 mt-8">
        <button 
            onClick={onCancel} 
            disabled={loading}
            className="bg-gray-500 text-white font-bold py-3 px-6 rounded-md hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Cancel
        </button>
        <button 
            onClick={onSave} 
            disabled={loading}
            className="bg-green-500 text-white font-bold py-3 px-6 rounded-md hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
            {loading ? 'Saving...' : 'Save Changes'}
        </button>
    </div>
);

export default ActionButtons;
