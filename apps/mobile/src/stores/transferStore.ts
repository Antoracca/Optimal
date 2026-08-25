import { create } from 'zustand';
import { COUNTRIES, Country } from '../data/countries';

export type DeliveryMethod = 'mobile_money' | 'bank_transfer' | 'cash_pickup';

// Taux fixe : 1 MAD = 60 XAF
export const EXCHANGE_RATE_MAD_TO_XAF = 60;

export type RecipientInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  rib?: string;
  city?: string;
  save?: boolean;
};

export type TransferState = {
  // Direction : 'cemac_to_maroc' ou 'maroc_to_cemac'
  direction: 'cemac_to_maroc' | 'maroc_to_cemac';
  
  // Pays source et destinataire
  sourceCountry: Country;
  destinationCountry: Country;

  // Montants
  sendAmount: string;
  receiveAmount: string;

  // Étape 1 : Moyen de paiement (source) - AUCUNE sélection automatique par défaut
  selectedPaymentMethod: string;
  selectedPaymentId: string;

  // Étape 2 : Mode de réception (destination) - AUCUNE sélection automatique par défaut
  deliveryMethod: DeliveryMethod;
  selectedOperator: string;
  selectedOperatorId: string;

  // Étape 3 : Informations Bénéficiaire
  recipient: RecipientInfo;

  // Actions
  setDirection: (direction: 'cemac_to_maroc' | 'maroc_to_cemac') => void;
  toggleDirection: () => void;
  setSourceCountry: (country: Country) => void;
  setDestinationCountry: (country: Country) => void;
  setSendAmount: (amount: string) => void;
  setReceiveAmount: (amount: string) => void;
  setSelectedPaymentMethod: (method: string, id?: string) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  setSelectedOperator: (operator: string, id?: string) => void;
  setRecipientInfo: (info: Partial<RecipientInfo>) => void;
  calculateAmounts: (amount: string, isSending: boolean) => void;
  resetSelections: () => void;
};

const defaultCemac = COUNTRIES.find((c) => c.iso === 'CM') || COUNTRIES[0];
const defaultMaroc = COUNTRIES.find((c) => c.iso === 'MA') || COUNTRIES[COUNTRIES.length - 1];

export const useTransferStore = create<TransferState>((set, get) => ({
  direction: 'cemac_to_maroc',
  sourceCountry: defaultCemac,
  destinationCountry: defaultMaroc,
  sendAmount: '0.00',
  receiveAmount: '0.00',
  selectedPaymentMethod: '',
  selectedPaymentId: '',
  deliveryMethod: 'mobile_money',
  selectedOperator: '',
  selectedOperatorId: '',
  recipient: {
    firstName: '',
    lastName: '',
    phone: '',
    rib: '',
    city: '',
    save: true,
  },

  resetSelections: () => {
    set({
      selectedPaymentMethod: '',
      selectedPaymentId: '',
      selectedOperator: '',
      selectedOperatorId: '',
      recipient: { firstName: '', lastName: '', phone: '', rib: '', city: '', save: true },
    });
  },

  setDirection: (direction) => {
    const { sendAmount } = get();
    if (direction === 'cemac_to_maroc') {
      set({
        direction,
        sourceCountry: defaultCemac,
        destinationCountry: defaultMaroc,
        selectedPaymentMethod: '',
        selectedPaymentId: '',
        selectedOperator: '',
        selectedOperatorId: '',
      });
      get().calculateAmounts(sendAmount, true);
    } else {
      set({
        direction,
        sourceCountry: defaultMaroc,
        destinationCountry: defaultCemac,
        selectedPaymentMethod: '',
        selectedPaymentId: '',
        selectedOperator: '',
        selectedOperatorId: '',
      });
      get().calculateAmounts(sendAmount, true);
    }
  },

  toggleDirection: () => {
    const { sourceCountry, destinationCountry, sendAmount } = get();
    const isCurrentlyMorocco = sourceCountry.iso === 'MA';

    if (isCurrentlyMorocco) {
      // Bascule vers CEMAC -> Maroc
      const nextSource = destinationCountry.iso !== 'MA' ? destinationCountry : defaultCemac;
      set({
        direction: 'cemac_to_maroc',
        sourceCountry: nextSource,
        destinationCountry: defaultMaroc,
        selectedPaymentMethod: '',
        selectedPaymentId: '',
        selectedOperator: '',
        selectedOperatorId: '',
      });
    } else {
      // Bascule vers Maroc -> CEMAC
      const nextDest = sourceCountry.iso !== 'MA' ? sourceCountry : defaultCemac;
      set({
        direction: 'maroc_to_cemac',
        sourceCountry: defaultMaroc,
        destinationCountry: nextDest,
        selectedPaymentMethod: '',
        selectedPaymentId: '',
        selectedOperator: '',
        selectedOperatorId: '',
      });
    }
    get().calculateAmounts(sendAmount, true);
  },

  setSourceCountry: (country) => {
    if (country.iso === 'MA') {
      const { destinationCountry } = get();
      set({
        direction: 'maroc_to_cemac',
        sourceCountry: country,
        destinationCountry: destinationCountry.iso === 'MA' ? defaultCemac : destinationCountry,
        selectedPaymentMethod: '',
        selectedPaymentId: '',
        selectedOperator: '',
        selectedOperatorId: '',
      });
    } else {
      set({
        direction: 'cemac_to_maroc',
        sourceCountry: country,
        destinationCountry: defaultMaroc,
        selectedPaymentMethod: '',
        selectedPaymentId: '',
        selectedOperator: '',
        selectedOperatorId: '',
      });
    }
  },
  setDestinationCountry: (country) => set({
    destinationCountry: country,
    selectedPaymentMethod: '',
    selectedPaymentId: '',
    selectedOperator: '',
    selectedOperatorId: '',
  }),

  setSendAmount: (sendAmount) => {
    get().calculateAmounts(sendAmount, true);
  },

  setReceiveAmount: (receiveAmount) => {
    get().calculateAmounts(receiveAmount, false);
  },

  setSelectedPaymentMethod: (selectedPaymentMethod, id = '') => set({ selectedPaymentMethod, selectedPaymentId: id }),
  setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
  setSelectedOperator: (selectedOperator, id = '') => set({ selectedOperator, selectedOperatorId: id }),
  setRecipientInfo: (info) => set((state) => ({ recipient: { ...state.recipient, ...info } })),

  calculateAmounts: (amountStr, isSending) => {
    const cleanStr = amountStr.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanStr) || 0;
    const { direction } = get();

    if (isSending) {
      if (direction === 'cemac_to_maroc') {
        // Envoi XAF ➔ Reçoit MAD
        const received = num > 0 ? (num / EXCHANGE_RATE_MAD_TO_XAF).toFixed(2) : '0';
        set({ sendAmount: cleanStr, receiveAmount: received });
      } else {
        // Envoi MAD ➔ Reçoit XAF
        const received = num > 0 ? Math.round(num * EXCHANGE_RATE_MAD_TO_XAF).toString() : '0';
        set({ sendAmount: cleanStr, receiveAmount: received });
      }
    } else {
      if (direction === 'cemac_to_maroc') {
        // Reçoit MAD ➔ Envoi XAF nécessaire
        const sent = num > 0 ? Math.round(num * EXCHANGE_RATE_MAD_TO_XAF).toString() : '0';
        set({ receiveAmount: cleanStr, sendAmount: sent });
      } else {
        // Reçoit XAF ➔ Envoi MAD nécessaire
        const sent = num > 0 ? (num / EXCHANGE_RATE_MAD_TO_XAF).toFixed(2) : '0';
        set({ receiveAmount: cleanStr, sendAmount: sent });
      }
    }
  },
}));
