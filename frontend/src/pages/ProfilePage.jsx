import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProfilePage = () => {
    const { userInfo } = useContext(AuthContext);

    return (
        <div className="w-full max-w-lg text-center">
            <div className="bg-white shadow-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h2>
                {userInfo ? (
                    <div className="text-left space-y-4">
                        <p className="text-lg"><strong className="font-semibold text-gray-600">Username:</strong> <span className="text-indigo-600">{userInfo.username}</span></p>
                        <p className="text-lg"><strong className="font-semibold text-gray-600">User ID:</strong> <span className="text-gray-700">{userInfo._id}</span></p>
                        <p className="mt-4 text-gray-500">Welcome to your protected profile page!</p>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
