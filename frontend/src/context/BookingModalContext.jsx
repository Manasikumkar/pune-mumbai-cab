import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Modal from "../components/ui/Modal";
import BookingForm from "../components/booking/BookingForm";

const BookingModalContext = createContext(null);

/**
 * Makes "Book Your Cab" available from anywhere in the app.
 * openBooking({ pickup: "Pune", drop: "Mumbai", vehicle: "suv" }) pre-fills the form.
 */
export function BookingModalProvider({ children }) {
  const [state, setState] = useState({ open: false, defaults: {}, key: 0 });

  const openBooking = useCallback((defaults = {}) => {
    setState((prev) => ({ open: true, defaults, key: prev.key + 1 }));
  }, []);

  const closeBooking = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const value = useMemo(
    () => ({ openBooking, closeBooking, isOpen: state.open }),
    [openBooking, closeBooking, state.open]
  );

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      <Modal
        open={state.open}
        onClose={closeBooking}
        title="Book Your Cab"
        description="Fixed fares, tolls included. We confirm on call or WhatsApp within 15 minutes."
      >
        <BookingForm key={state.key} defaultValues={state.defaults} compact source="home-modal" />
      </Modal>
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const context = useContext(BookingModalContext);
  if (!context) {
    throw new Error("useBookingModal must be used inside <BookingModalProvider>");
  }
  return context;
}
