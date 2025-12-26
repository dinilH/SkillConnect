import { createContext, useContext, useState } from "react";

const ModalContext = createContext({
  authModalOpen: false,
  authModalMode: "signin",
  openAuthModal: (_mode) => {},
  closeAuthModal: () => {},
});

export function ModalProvider({ children }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("signin");

  const openAuthModal = (mode = "signin") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    // prevent background scroll while modal open
    document.body.style.overflow = "hidden";
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <ModalContext.Provider value={{ authModalOpen, authModalMode, openAuthModal, closeAuthModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
