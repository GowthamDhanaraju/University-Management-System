import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IoMdNotifications } from "react-icons/io";

// Notification badge component
const NotificationBadge = ({ count }: { count: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 rounded-full hover:bg-gray-700"
      >
        <IoMdNotifications className="text-gray-300 text-lg" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700">
          <div className="p-3 border-b border-gray-700">
            <h3 className="font-medium">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {count > 0 ? (
              <div className="p-3 hover:bg-gray-700 cursor-pointer">
                <p className="text-sm">Notification example</p>
                <p className="text-xs text-gray-400">1 minute ago</p>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-400">
                <p>No new notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TopBar: React.FC = () => {
  const router = useRouter();
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  
  useEffect(() => {
    setMounted(true);
    // Update time every minute
    const interval = setInterval(() => setTime(new Date()), 60000);
    
    // Get user data from localStorage
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) setUserName(storedUserName);
    
    // Fetch notifications (mock for now)
    const fetchNotifications = async () => {
      try {
        // This would be a real API call in production
        // For now, just set a random number for demonstration
        setNotificationCount(Math.floor(Math.random() * 5));
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    
    fetchNotifications();
    
    return () => clearInterval(interval);
  }, []);
  
  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");
    
    // Redirect to login page
    router.push("/");
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          {mounted ? (
            <>
              <span className="text-2xl font-semibold mr-2">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-gray-400">|</span>
              <span className="ml-2 text-gray-300">
                {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </>
          ) : (
            <span className="text-gray-400">Loading...</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <NotificationBadge count={notificationCount} />
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
      <hr className="border-gray-700 mb-6" />
    </>
  );
};

export default TopBar;
