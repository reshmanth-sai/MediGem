"use client";

import React, { createContext, useContext, useState } from "react";

interface DialogContextType {
  activeDialog: string | null;
  openDialog: (id: string) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const openDialog = (id: string) => setActiveDialog(id);
  const closeDialog = () => setActiveDialog(null);

  return (
    <DialogContext.Provider value={{ activeDialog, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
}

export function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }
  return context;
}
