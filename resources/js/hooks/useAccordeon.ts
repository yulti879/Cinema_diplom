import { useState } from 'react';

export const useAccordeon = (initialState: Record<string, boolean> = {}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(initialState);
  
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const openSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: true
    }));
  };

  const closeSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: false
    }));
  };

  const toggleAllSections = (open: boolean) => {
    const newState: Record<string, boolean> = {};
    Object.keys(openSections).forEach(key => {
      newState[key] = open;
    });
    setOpenSections(newState);
  };

  return {
    openSections,
    toggleSection,
    openSection,
    closeSection,
    toggleAllSections
  };
};