import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/api';
import { toast } from 'react-toastify';
import { CameraIcon } from '@heroicons/react/24/solid';
import imageCompression from 'browser-image-compression';

const ProfilePage = () => {
    const { userInfo, setUserInfo } = useContext(AuthContext);
    
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [compressionProgress, setCompressionProgress] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false); // Loading state for profile update

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name || '');
            setBio(userInfo.bio || '');
            setAvatarPreview(userInfo.avatar);
        }
    }, [userInfo]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
            // fileType: 'image/webp',
            onProgress: (p) => {
                setCompressionProgress(p);
            }
        };

        try {
            const compressedFile = await imageCompression(file, options);
            setAvatarFile(compressedFile);
            setAvatarPreview(URL.createObjectURL(compressedFile));

        } catch (error) {
            toast.error('Failed to compress image.');
            console.error(error);
        } finally {
            setTimeout(() => setCompressionProgress(0), 1000);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true); // Start loading
        try {
            const { data: updatedUser } = await api.put('/api/users/profile', { name, bio });
            setUserInfo(updatedUser);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile.');
        } finally {
            setIsUpdating(false); // Stop loading
        }
    };

    const handleAvatarUpdate = async () => {
        if (!avatarFile) return;

        const formData = new FormData();
        formData.append('avatar', avatarFile, avatarFile.name);
        
        setUploadProgress(0);

        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    }
                },
            };

            await api.post('/api/users/profile/avatar', formData, config);
            
            const { data: profileData } = await api.get('/api/users/profile');
            setUserInfo(profileData);
            
            toast.success('Avatar successfully uploaded!');
            setAvatarFile(null);

        } catch (error) {
            toast.error('Failed to update avatar.');
        } finally {
            setTimeout(() => setUploadProgress(0), 1500);
        }
    };
    
    useEffect(() => {
        if (avatarFile) {
            handleAvatarUpdate();
        }
    }, [avatarFile]);

    if (!userInfo) {
        return <div className="flex justify-center items-center h-full"><Loader /></div>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white shadow-2xl rounded-2xl p-8 transform transition-all duration-500">
                <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
                    <div className="relative group mb-6 md:mb-0">
                        {avatarPreview && <img src={avatarPreview} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-indigo-200 shadow-lg"/>}
                        <label htmlFor="avatar-upload" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <CameraIcon className="h-10 w-10 text-white" />
                        </label>
                        <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="text-center md:text-left flex-grow">
                        {!isEditing ? (
                            <>
                                <h2 className="text-4xl font-bold text-gray-800">{name || userInfo.username}</h2>
                                <p className="text-gray-500 mt-1">@{userInfo.username}</p>
                                <p className="text-gray-700 mt-4">{bio || 'No bio yet. Click edit to add one.'}</p>
                                <button onClick={() => setIsEditing(true)} className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                                    Edit Profile
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                {/* ... form inputs ... */}
                                 <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                                    <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isUpdating} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center disabled:opacity-75">
                                        {isUpdating ? <div className="loader-button-small"></div> : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}
                        
                        {/* ... progress bars ... */}
                        {compressionProgress > 0 && (
                             <div className="mt-4">
                                <p className="text-sm text-center text-blue-600">Compressing...</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${compressionProgress}%` }}></div>
                                </div>
                            </div>
                        )}

                        {uploadProgress > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-center text-indigo-600">Uploading...</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add loader style for small buttons
const smallLoaderStyles = `
.loader-button-small {
  width: 20px;
  height: 20px;
  border: 3px solid #FFF;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
`;
const smallLoaderStyleSheet = document.createElement("style");
smallLoaderStyleSheet.innerText = smallLoaderStyles;
document.head.appendChild(smallLoaderStyleSheet);

export default ProfilePage;

