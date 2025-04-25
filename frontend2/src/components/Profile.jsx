import React from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Package, 
  Calendar, 
  CreditCard, 
  Heart,
  ShoppingBag,
  Settings,
  ChevronRight,
  Truck,
  Bell
} from 'lucide-react';


// accountCreated	2025-04-25T19:32:38.701Z
// description	lklk
// email	sanyam@gmail.com
// location	nn
// name	Sanyam
// password	1234
// todos	[]




const Profile = ({ user }) => {
  // Ensure user data is available, provide defaults if not
  const name = localStorage.getItem('name')
  const username = localStorage.getItem('name') 
  const location = localStorage.getItem('location') 
  const email = localStorage.getItem('email')  
  const joined = localStorage.getItem('accountCreated')
  const bio = localStorage.getItem('description')

  
  const userData = user || {
    name,
    username,
    location,
    email,
    joined,
    bio,
    profileImage: 'https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png', // Provide a default image
  };

  return (
    <div className="min-h-screen pt-8 pb-16 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8 animate-fadeIn">
        <div className="overflow-hidden bg-white border border-green-100 shadow-sm rounded-2xl">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-green-500 to-green-600"></div>
            <div className="absolute overflow-hidden transition-transform duration-300 border-4 border-white rounded-full shadow-md -bottom-16 left-6 sm:left-8 hover:scale-105">
              <img 
                src={userData.profileImage} 
                alt={userData.name} 
                className="object-cover w-32 h-32"
              />
            </div>
            {/* <div className="absolute top-4 right-4">
              <button className="flex items-center gap-2 px-4 py-2 text-white transition-all duration-300 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20">
                <Settings size={16} />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
            </div> */}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-8 mt-20 sm:px-8">
            <div className="flex flex-col justify-between sm:flex-row sm:items-end">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                <p className="font-medium text-green-600">{userData.membershipLevel}</p>
              </div>
              <div className="flex items-center gap-1 mt-4 text-gray-600 sm:mt-0">
                <Calendar size={16} className="text-green-500" />
                <span className="text-sm">Member since {userData.joined}</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="leading-relaxed text-gray-700">{userData.bio}</p>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} className="text-green-500" />
                <span>{userData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={18} className="text-green-500" />
                <a href={`mailto:${userData.email}`} className="transition-colors hover:text-green-500">
                  {userData.email}
                </a>
              </div>
            </div>

            {/* Stats */}
            {/* <div className="flex gap-8 py-4 mt-8 overflow-x-auto border-gray-100 border-y">
              <div className="text-center min-w-[80px]">
                <p className="text-2xl font-bold text-gray-900">{userData.stats?.orders}</p>
                <p className="text-sm text-gray-500">Orders</p>
              </div>
              <div className="text-center min-w-[80px]">
                <p className="text-2xl font-bold text-gray-900">{userData.stats?.savedItems}</p>
                <p className="text-sm text-gray-500">Saved Items</p>
              </div>
              <div className="text-center min-w-[80px]">
                <p className="text-2xl font-bold text-gray-900">{userData.stats?.reviews}</p>
                <p className="text-sm text-gray-500">Reviews</p>
              </div>
            </div> */}

            {/* Quick Actions */}
            {/* <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">
              <a href="#" className="flex items-center gap-3 p-4 transition-colors duration-300 rounded-xl bg-green-50 hover:bg-green-100">
                <ShoppingBag className="text-green-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">My Orders</p>
                  <p className="text-sm text-gray-600">View order history and tracking</p>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 p-4 transition-colors duration-300 rounded-xl bg-green-50 hover:bg-green-100">
                <Heart className="text-green-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Wishlist</p>
                  <p className="text-sm text-gray-600">Items you've saved</p>
                </div>
              </a>
            </div> */}

            {/* Settings Links */}
            {/* <div className="mt-8 space-y-3">
              <a href="#" className="block group">
                <div className="flex items-center justify-between p-3 transition-colors duration-300 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50">
                      <CreditCard size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Payment Methods</p>
                      <p className="text-sm text-gray-500">Manage your payment options</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 transition-colors group-hover:text-green-500" />
                </div>
              </a>
              <a href="#" className="block group">
                <div className="flex items-center justify-between p-3 transition-colors duration-300 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50">
                      <Truck size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Shipping Addresses</p>
                      <p className="text-sm text-gray-500">Manage delivery locations</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 transition-colors group-hover:text-green-500" />
                </div>
              </a>
              <a href="#" className="block group">
                <div className="flex items-center justify-between p-3 transition-colors duration-300 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50">
                      <Bell size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Notifications</p>
                      <p className="text-sm text-gray-500">Set your notification preferences</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 transition-colors group-hover:text-green-500" />
                </div>
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;