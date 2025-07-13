"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PremiumStatus from "./PremiumStatus";
import Footer from "@/app/partial/footer";
import NavbarWrapper from "@/app/components/NavbarWrapper";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const router = useRouter();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=profile");
    }
  }, [user, isLoading, router]);
  
  // Set initial values from user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setDescription(user.description || "");
      setPreviewUrl(user.profilePicture || "");
    }
  }, [user]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage("");
    setError("");
    
    try {
      // First update profile text fields
      const profileResponse = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description
        })
      });
      
      if (!profileResponse.ok) {
        throw new Error('Failed to update profile information');
      }
      
      // Then handle image upload if present
      if (profileImage) {
        const formData = new FormData();
        formData.append('profilePicture', profileImage);
        
        const imageResponse = await fetch('/api/user/profile-picture', {
          method: 'POST',
          body: formData
        });
        
        if (!imageResponse.ok) {
          throw new Error('Failed to upload profile picture');
        }
        
        const imageData = await imageResponse.json();
        setPreviewUrl(imageData.imageUrl);
      }
      
      setMessage('Profil zaktualizowany pomyślnie');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Wystąpił błąd podczas aktualizacji profilu');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  
  if (isLoading) {
    return (
      <NavbarWrapper>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--primary)]"></div>
          </div>
        </div>
        <Footer />
      </NavbarWrapper>
    );
  }
  
  if (!user) {
    return null; // Will be redirected by the useEffect
  }
  
  return (
    <NavbarWrapper>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Twój profil</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - User info */}
            <div className="lg:col-span-2">
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-bold mb-6">Twoje dane</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    <div className="sm:w-1/3 flex flex-col items-center">
                      <div className="relative mb-4 w-32 h-32">
                        <div className="w-32 h-32 rounded-full bg-[var(--bg-light)] overflow-hidden">
                          {previewUrl ? (
                            <img 
                              src={previewUrl} 
                              alt="Profile" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl">👤</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-0 right-0">
                          <label htmlFor="profilePicture" className="cursor-pointer">
                            <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </div>
                          </label>
                          <input 
                            id="profilePicture" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-[var(--text-gray)]">
                        Kliknij zdjęcie, aby zmienić
                      </div>
                    </div>
                    
                    <div className="sm:w-2/3">
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input 
                          type="text" 
                          value={user.email} 
                          className="input bg-[var(--bg-light)]" 
                          disabled 
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Imię / Pseudonim</label>
                        <input 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          className="input" 
                          placeholder="Jak mamy do Ciebie mówić?" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">O mnie</label>
                    <textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)}
                      className="input min-h-[120px]" 
                      placeholder="Napisz coś o sobie..."
                    />
                  </div>
                  
                  {message && (
                    <div className="alert alert-success mb-6">
                      {message}
                    </div>
                  )}
                  
                  {error && (
                    <div className="alert alert-error mb-6">
                      {error}
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Link href="/reset-password" className="text-[var(--primary)] hover:underline">
                      Zmień hasło
                    </Link>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Aktualizacja...' : 'Zapisz zmiany'}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Game Stats would go here */}
            </div>
            
            {/* Right column - Membership info */}
            <div>
              <PremiumStatus user={user} />
              
              {!user.hasPremium && user.freeTrialGamesLeft > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="card p-6 mb-6 bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300"
                >
                  <h2 className="text-xl font-bold mb-4 text-yellow-800">Darmowe próby premium</h2>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-yellow-800">Pozostałe gry:</span>
                      <span className="text-2xl font-bold text-yellow-800">{user.freeTrialGamesLeft}</span>
                    </div>
                    
                    <div className="w-full bg-yellow-200 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-500 h-2.5 rounded-full" 
                        style={{ width: `${(user.freeTrialGamesLeft / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-yellow-700 mb-4">
                    Wykorzystaj swoje darmowe gry w trybach Hardcore i Quick, aby przekonać się o korzyściach wersji premium!
                  </p>
                  
                  <Link href="/premium" className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 border-yellow-600 text-yellow-900 w-full">
                    Kup Premium
                  </Link>
                </motion.div>
              )}
              
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-4">Konto</h2>
                <div className="mb-4">
                  <div className="text-sm text-[var(--text-gray)]">Data utworzenia</div>
                  <div className="font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL') : 'N/A'}
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline btn-error w-full"
                >
                  Wyloguj
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </NavbarWrapper>
  );
} 