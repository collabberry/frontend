import { useState } from "react";

export const useDialog = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    return { isOpen, openDialog, closeDialog };
};