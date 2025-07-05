"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Comeback from "@/app/partial/comeback";
import PremiumStatus from './PremiumStatus';

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    profilePicture: '',
    newPassword: '',
    confirmPassword: '',
    currentPassword: '',
  });
  
  // Stan dla pliku zdjęcia
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  
  // Form validation states
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    profilePicture: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    file: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [isProfileFormValid, setIsProfileFormValid] = useState(false);
  const [isPasswordFormValid, setIsPasswordFormValid] = useState(false);
  const [isPictureFormValid, setIsPictureFormValid] = useState(false);

  // Maksymalny rozmiar pliku (8MB)
  const MAX_FILE_SIZE = 8 * 1024 * 1024;
  
  // Dozwolone typy plików
  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        description: user.description || '',
        profilePicture: user.profilePicture || '',
      }));
      
      // Jeśli użytkownik ma już zdjęcie profilowe, ustaw je jako podgląd
      if (user.profilePicture) {
        setPreviewUrl(user.profilePicture);
      }
    }
  }, [user, isLoading, isAuthenticated, router]);
  
  // Czyszczenie URL podglądu przy odmontowaniu komponentu
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Validate inputs
  const validateName = (name) => {
    if (name && name.length > 50) {
      return 'Nazwa użytkownika nie może przekraczać 50 znaków';
    }
    return '';
  };

  const validateDescription = (description) => {
    if (description && description.length > 500) {
      return 'Opis nie może przekraczać 500 znaków';
    }
    return '';
  };

  const validateProfilePicture = (url) => {
    if (!url) return '';
    try {
      new URL(url);
      return '';
    } catch (e) {
      return 'Podaj poprawny adres URL';
    }
  };
  
  const validateFile = (file) => {
    if (!file) return '';
    
    // Sprawdź rozmiar pliku
    if (file.size > MAX_FILE_SIZE) {
      return `Plik jest za duży. Maksymalny rozmiar to 8MB.`;
    }
    
    // Sprawdź typ pliku
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Niedozwolony format pliku. Dozwolone są tylko obrazy (JPEG, PNG, GIF, WebP, SVG).';
    }
    
    return '';
  };

  const validatePassword = (password, field) => {
    if (!password) {
      return field === 'currentPassword' 
        ? 'Aktualne hasło jest wymagane' 
        : 'Nowe hasło jest wymagane';
    }
    if (password.length < 6) {
      return 'Hasło musi mieć co najmniej 6 znaków';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return 'Potwierdź nowe hasło';
    }
    if (confirmPassword !== password) {
      return 'Hasła nie są identyczne';
    }
    return '';
  };

  // Update form validity
  useEffect(() => {
    const nameError = validateName(formData.name);
    const descriptionError = validateDescription(formData.description);
    setIsProfileFormValid(!nameError && !descriptionError);

    const currentPasswordError = validatePassword(formData.currentPassword, 'currentPassword');
    const newPasswordError = validatePassword(formData.newPassword, 'newPassword');
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.newPassword);
    setIsPasswordFormValid(!currentPasswordError && !newPasswordError && !confirmPasswordError);

    const fileError = selectedFile ? validateFile(selectedFile) : '';
    setIsPictureFormValid(selectedFile && !fileError);
  }, [formData, selectedFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    switch (name) {
      case 'name':
        setErrors(prev => ({ ...prev, name: validateName(value) }));
        break;
      case 'description':
        setErrors(prev => ({ ...prev, description: validateDescription(value) }));
        break;
      case 'profilePicture':
        setErrors(prev => ({ ...prev, profilePicture: validateProfilePicture(value) }));
        break;
      case 'currentPassword':
        setErrors(prev => ({ ...prev, currentPassword: validatePassword(value, 'currentPassword') }));
        break;
      case 'newPassword':
        setErrors(prev => ({ 
          ...prev, 
          newPassword: validatePassword(value, 'newPassword'),
          confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
        }));
        break;
      case 'confirmPassword':
        setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(value, formData.newPassword) }));
        break;
      default:
        break;
    }
  };
  
  // Obsługa wyboru pliku
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Walidacja pliku
      const fileError = validateFile(file);
      setErrors(prev => ({ ...prev, file: fileError }));
      
      if (!fileError) {
        setSelectedFile(file);
        
        // Tworzenie URL podglądu
        if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
        
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      } else {
        setSelectedFile(null);
        if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl('');
        }
      }
    }
  };
  
  // Obsługa przycisku "wybierz plik"
  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    const nameError = validateName(formData.name);
    const descriptionError = validateDescription(formData.description);
    
    if (nameError || descriptionError) {
      setErrors(prev => ({ 
        ...prev, 
        name: nameError, 
        description: descriptionError 
      }));
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Sanityzacja danych przed wysłaniem
      const sanitizedData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil został zaktualizowany' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Coś poszło nie tak' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas aktualizacji profilu' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    const currentPasswordError = validatePassword(formData.currentPassword, 'currentPassword');
    const newPasswordError = validatePassword(formData.newPassword, 'newPassword');
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.newPassword);
    
    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      setErrors(prev => ({ 
        ...prev, 
        currentPassword: currentPasswordError, 
        newPassword: newPasswordError,
        confirmPassword: confirmPasswordError
      }));
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Hasło zostało zmienione' });
        setFormData(prev => ({
          ...prev,
          newPassword: '',
          confirmPassword: '',
          currentPassword: '',
        }));
      } else {
        setMessage({ type: 'error', text: data.error || 'Coś poszło nie tak' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas zmiany hasła' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfilePictureSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setErrors(prev => ({ ...prev, file: 'Wybierz plik ze zdjęciem' }));
      return;
    }
    
    // Final validation
    const fileError = validateFile(selectedFile);
    
    if (fileError) {
      setErrors(prev => ({ ...prev, file: fileError }));
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Utworzenie obiektu FormData i dodanie pliku
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Wysłanie żądania
      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Zdjęcie profilowe zostało zaktualizowane' });
        // Zaktualizuj dane użytkownika
        if (data.user && data.user.profilePicture) {
          setFormData(prev => ({
            ...prev,
            profilePicture: data.user.profilePicture
          }));
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Coś poszło nie tak' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas aktualizacji zdjęcia profilowego' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage({ type: '', text: '' }); // Clear messages when switching tabs
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return ( 
    <motion.div 
      className="container mx-auto px-4 py-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-3xl font-bold mb-8 text-center gradient-text"
        variants={itemVariants}
      >
        Twój profil
      </motion.h1>
      
      {message.text && (
        <motion.div 
          className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-500/20 text-green-500 border border-green-500' 
              : 'bg-red-500/20 text-red-500 border border-red-500'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {message.text}
        </motion.div>
      )}
        <Comeback />
      <motion.div 
        className="flex flex-wrap mb-6 border-b border-[var(--border-color)]"
        variants={itemVariants}
      >
        <button
          className={`mr-2 px-4 py-2 rounded-t-md ${
            activeTab === 'profile' 
              ? 'bg-[var(--primary)] text-white' 
              : 'bg-[var(--container-color)] text-[var(--text-color)]'
          }`}
          onClick={() => handleTabChange('profile')}
        >
          Profil
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded-t-md ${
            activeTab === 'password' 
              ? 'bg-[var(--primary)] text-white' 
              : 'bg-[var(--container-color)] text-[var(--text-color)]'
          }`}
          onClick={() => handleTabChange('password')}
        >
          Zmień hasło
        </button>
        <button
          className={`px-4 py-2 rounded-t-md ${
            activeTab === 'picture' 
              ? 'bg-[var(--primary)] text-white' 
              : 'bg-[var(--container-color)] text-[var(--text-color)]'
          }`}
          onClick={() => handleTabChange('picture')}
        >
          Zdjęcie profilowe
        </button>
        <button
          className={`px-4 py-2 rounded-t-md ${
            activeTab === 'premium' 
              ? 'bg-[var(--primary)] text-white' 
              : 'bg-[var(--container-color)] text-[var(--text-color)]'
          }`}
          onClick={() => handleTabChange('premium')}
        >
          Premium
        </button>
      </motion.div>

      <motion.div 
        className="card"
        variants={itemVariants}
      >
        {activeTab === 'profile' && (
          <motion.form 
            onSubmit={handleProfileSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <label className="block text-[var(--text-gray)] text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full bg-[var(--body-color)] border border-[var(--border-color)] rounded-lg p-3 text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                id="email"
                type="email"
                value={formData.email}
                disabled
              />
              <p className="text-xs text-[var(--text-gray)] mt-1">Adresu email nie można zmienić</p>
            </div>
            <div className="mb-4">
              <label className="block text-[var(--text-gray)] text-sm font-medium mb-2" htmlFor="name">
                Nazwa użytkownika
              </label>
              <input
                className={`w-full bg-[var(--body-color)] border ${
                  errors.name ? 'border-red-500' : 'border-[var(--border-color)]'
                } rounded-lg p-3 text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all`}
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-[var(--text-gray)] text-sm font-medium mb-2" htmlFor="description">
                Opis
              </label>
              <textarea
                className={`w-full bg-[var(--body-color)] border ${
                  errors.description ? 'border-red-500' : 'border-[var(--border-color)]'
                } rounded-lg p-3 text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all`}
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-[var(--text-gray)] mt-1">
                {formData.description ? `${formData.description.length}/500 znaków` : '0/500 znaków'}
              </p>
            </div>
            <div className="flex items-center justify-end">
              <motion.button
                className={`btn ${isProfileFormValid ? 'btn-primary' : 'btn-disabled'}`}
                type="submit"
                disabled={isSubmitting || !isProfileFormValid}
                whileHover={isProfileFormValid ? { scale: 1.02 } : {}}
                whileTap={isProfileFormValid ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </motion.button>
            </div>
          </motion.form>
        )}
        
        {activeTab === 'password' && (
          <motion.form 
            onSubmit={handlePasswordSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <label className="block text-[var(--text-gray)] text-sm font-medium mb-2" htmlFor="currentPassword">
                Aktualne hasło
              </label>
              <input
                className={`w-full bg-[var(--body-color)] border ${
                  errors.currentPassword ? 'border-red-500' : 'border-[var(--border-color)]'
                } rounded-lg p-3 text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all`}
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
              {errors.currentPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-[var(--text-gray)] text-sm font-medium mb-2" htmlFor="newPassword">
                Nowe hasło
              </label>
              <input
                className={`w-full bg-[var(--body-color)] border ${
                  errors.newPassword ? 'border-red-500' : 'border-[var(--border-color)]'
                } rounded-lg p-3 text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all`}
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                minLength="6"
                required
              />
              {errors.newPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-[var(--text-gray)] text-sm font-medium mb-2" htmlFor="confirmPassword">
                Potwierdź nowe hasło
              </label>
              <input
                className={`w-full bg-[var(--body-color)] border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-[var(--border-color)]'
                } rounded-lg p-3 text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all`}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength="6"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <motion.button
                className={`btn ${isPasswordFormValid ? 'btn-primary' : 'btn-disabled'}`}
                type="submit"
                disabled={isSubmitting || !isPasswordFormValid}
                whileHover={isPasswordFormValid ? { scale: 1.02 } : {}}
                whileTap={isPasswordFormValid ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? 'Zmienianie...' : 'Zmień hasło'}
              </motion.button>
              <Link
                className="font-medium text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors"
                href="/reset-password"
              >
                Zapomniałeś hasła?
              </Link>
            </div>
          </motion.form>
        )}
        
        {activeTab === 'picture' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 flex flex-col items-center">
              {/* Podgląd zdjęcia */}
              <motion.div 
                className="w-48 h-48 rounded-full overflow-hidden mb-4 bg-[var(--container-color)] flex items-center justify-center border-2 border-[var(--primary)]"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {previewUrl ? (
                  <Image 
                    src={previewUrl} 
                    alt="Podgląd zdjęcia profilowego" 
                    width={192} 
                    height={192} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-[var(--text-gray)] text-6xl">👤</span>
                )}
              </motion.div>
              
              {/* Formularz do przesyłania zdjęcia */}
              <form onSubmit={handleProfilePictureSubmit} className="w-full max-w-md">
                {/* Ukryte pole input dla pliku */}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="profileImage"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                {/* Przycisk do wyboru pliku */}
                <div className="mb-4 flex flex-col items-center">
                  <motion.button
                    type="button"
                    onClick={handleSelectFile}
                    className="btn btn-outline mb-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Wybierz zdjęcie
                  </motion.button>
                  
                  {selectedFile && (
                    <p className="text-xs text-[var(--text-gray)]">
                      Wybrany plik: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  
                  {errors.file && (
                    <p className="text-red-400 text-sm mt-1">{errors.file}</p>
                  )}
                  
                  <p className="text-xs text-[var(--text-gray)] mt-2">
                    Dozwolone formaty: JPEG, PNG, GIF, WebP, SVG (max. 8MB)
                  </p>
                </div>
                
                {/* Przycisk do przesłania pliku */}
                <div className="flex items-center justify-center mt-4">
                  <motion.button
                    className={`btn ${isPictureFormValid ? 'btn-primary' : 'btn-disabled'}`}
                    type="submit"
                    disabled={isSubmitting || !isPictureFormValid}
                    whileHover={isPictureFormValid ? { scale: 1.02 } : {}}
                    whileTap={isPictureFormValid ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? 'Przesyłanie...' : 'Prześlij zdjęcie'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
        {activeTab === 'premium' && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Status Premium</h2>
              <p className="text-[var(--text-gray)] mb-6">
                Sprawdź status swojego konta premium i dostępne funkcje.
              </p>
            </div>
            
            <PremiumStatus user={user} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
} 