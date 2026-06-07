"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ModalOptions = {
  id: string;
  title?: string;
  description?: string;
  content?: ReactNode;
  footer?: ReactNode;
};

type ModalContextType = {
  openModal: (options: ModalOptions) => void;
  closeModal: (id: string) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
}

export function ModalProvider({children}: {children: ReactNode}) {
  const [modals, setModals] = useState<ModalOptions[]>([]);

  const openModal = (options: ModalOptions) => {
    setModals((prev) => [...prev, options]);
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.slice(0, -1));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map((modal) => (
        <Dialog
          key={modal.id}
          open={true}
          onOpenChange={(open) => {
            if (!open) closeModal(modal.id);
          }}
        >
          <DialogContent>
            {(modal.title || modal.description) && (
              <DialogHeader>
                {modal.title && <DialogTitle>{modal.title}</DialogTitle>}
                {modal.description && (
                  <DialogDescription>{modal.description}</DialogDescription>
                )}
              </DialogHeader>
            )}

            {modal.content && <div className="py-2">{modal.content}</div>}

            <DialogFooter>
              {modal.footer || (
                <Button
                  variant="secondary"
                  onClick={() => closeModal(modal.id)}
                >
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </ModalContext.Provider>
  );
}
