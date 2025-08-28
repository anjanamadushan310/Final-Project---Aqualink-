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

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setProfile(response.data);
                setInitialProfile(response.data);
                
                if (response.data.addressDistrict) {
                    setAvailableTowns(districtToTowns[response.data.addressDistrict] || []);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

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
        const formData = new FormData();
        formData.append('profileData', new Blob([JSON.stringify(profile)], { type: 'application/json' }));
        
        if (logoFile) formData.append('logo', logoFile);

        try {
            const response = await axios.put('/api/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProfile(response.data);
            setInitialProfile(response.data);
            setEditingSection(null);
            setErrors({});
            setLogoFile(null);
            
            console.log('Profile updated successfully');
        } catch (error) {
            console.error("Failed to update profile:", error);
            setErrors({ general: 'Failed to save changes. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setProfile(initialProfile);
        setEditingSection(null);
        setErrors({});
        setLogoFile(null);
        
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
