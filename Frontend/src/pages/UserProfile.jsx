import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/user-profile/LoadingSpinner';
import ErrorDisplay from '../components/user-profile/ErrorDisplay';
import ProfileSection from '../components/user-profile/ProfileSection';
import BasicInformationSection from '../components/user-profile/BasicInformationSection';
import AddressSection from './../components/user-profile/AddressSection';
import ActionButtons from '../components/user-profile/ActionButtons';
import { districtToTowns } from '../components/user-profile/locationData';

const UserProfile = () => {
    const [profile, setProfile] = useState({});
    const [initialProfile, setInitialProfile] = useState({});
    const [editingSection, setEditingSection] = useState(null);
    const [errors, setErrors] = useState({});
    const [logoFile, setLogoFile] = useState(null);
    const [availableTowns, setAvailableTowns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // API base URL
    const API_BASE_URL = 'http://localhost:8080';

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get(`${API_BASE_URL}/api/profile`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Profile fetched successfully:', response.data);
            setProfile(response.data);
            setInitialProfile(response.data);
            
            if (response.data.addressDistrict) {
                setAvailableTowns(districtToTowns[response.data.addressDistrict] || []);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            if (error.response?.status === 401) {
                // Handle authentication error
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                setErrors({ general: 'Failed to load profile. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'addressDistrict') {
            const towns = districtToTowns[value] || [];
            setAvailableTowns(towns);
            setProfile({ 
                ...profile, 
                [name]: value,
                addressTown: ''
            });
        } else {
            setProfile({ ...profile, [name]: value });
        }
        
        // Clear errors for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };
    
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length === 0) return;
        
        const file = files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (file.size > maxSize) {
            setErrors({ ...errors, [name]: 'File size should not exceed 5MB' });
            return;
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setErrors({ ...errors, [name]: 'Only JPEG, PNG, and GIF images are allowed' });
            return;
        }
        
        if (name === 'logo') {
            setLogoFile(file);
        }
        
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (editingSection === 'basic') {
            if (!profile.businessName?.trim()) {
                newErrors.businessName = 'Business name is required.';
            }
            if (!profile.businessType?.trim()) {
                newErrors.businessType = 'Business type is required.';
            }
        }
        
        if (editingSection === 'address') {
            if (!profile.addressPlace?.trim()) {
                newErrors.addressPlace = 'Place/Building is required.';
            }
            if (!profile.addressStreet?.trim()) {
                newErrors.addressStreet = 'Street is required.';
            }
            if (!profile.addressDistrict) {
                newErrors.addressDistrict = 'Please select a district.';
            }
            if (!profile.addressTown?.trim()) {
                newErrors.addressTown = 'Please select a town.';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const formData = new FormData();
            formData.append('profileData', JSON.stringify(profile));
            
            if (logoFile) {
                formData.append('logo', logoFile);
            }

            const response = await axios.put(`${API_BASE_URL}/api/profile`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Profile updated successfully:', response.data);
            
            // Update state with response data
            setProfile(response.data);
            setInitialProfile(response.data);
            setEditingSection(null);
            setErrors({});
            setLogoFile(null);
            setSuccessMessage('Profile updated successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (error) {
            console.error("Failed to update profile:", error);
            
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else if (error.response?.data?.error) {
                setErrors({ general: error.response.data.error });
            } else {
                setErrors({ general: 'Failed to save changes. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setProfile(initialProfile);
        setEditingSection(null);
        setErrors({});
        setLogoFile(null);
        setSuccessMessage('');
        
        if (initialProfile.addressDistrict) {
            setAvailableTowns(districtToTowns[initialProfile.addressDistrict] || []);
        } else {
            setAvailableTowns([]);
        }
    };

    const isEditing = (section) => editingSection === section;

    if (loading && !profile.businessName) {
        return <LoadingSpinner message="Loading profile..." />;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">My Business Profile</h1>
            
            <ErrorDisplay error={errors.general} />
            
            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {successMessage}
                </div>
            )}
            
            {/* Basic Information Section */}
            <ProfileSection 
                title="Basic Information" 
                onEdit={() => setEditingSection('basic')} 
                isEditing={isEditing('basic')}
            >
                <BasicInformationSection
                    profile={profile}
                    isEditing={isEditing('basic')}
                    onInputChange={handleInputChange}
                    onFileChange={handleFileChange}
                    errors={errors}
                    logoFile={logoFile}
                />
            </ProfileSection>

            {/* Business Address Section */}
            <ProfileSection 
                title="Business Address" 
                onEdit={() => setEditingSection('address')} 
                isEditing={isEditing('address')}
            >
                <AddressSection
                    profile={profile}
                    isEditing={isEditing('address')}
                    onInputChange={handleInputChange}
                    errors={errors}
                    availableTowns={availableTowns}
                />
            </ProfileSection>

            {/* Action Buttons */}
            {editingSection && (
                <ActionButtons
                    onCancel={handleCancel}
                    onSave={handleSave}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default UserProfile;
