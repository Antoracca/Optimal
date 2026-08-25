import React from 'react';
import { useTransferStore } from '../../src/stores/transferStore';
import { OrangeMoneyCheckout } from '../../src/components/checkout/OrangeMoneyCheckout';
import { MtnMomoCheckout } from '../../src/components/checkout/MtnMomoCheckout';
import { AirtelMoneyCheckout } from '../../src/components/checkout/AirtelMoneyCheckout';
import { MoovMoneyCheckout } from '../../src/components/checkout/MoovMoneyCheckout';
import { CardCheckout } from '../../src/components/checkout/CardCheckout';
import { RelayDepositCheckout } from '../../src/components/checkout/RelayDepositCheckout';

/**
 * Routeur dynamique de la passerelle de paiement
 * Affiche l'interface dédiée et configurée spécifiquement pour chaque opérateur / méthode
 */
export default function DynamicPaymentCheckoutScreen() {
  const { selectedPaymentId } = useTransferStore();

  switch (selectedPaymentId) {
    case 'orange':
      return <OrangeMoneyCheckout />;

    case 'mtn':
      return <MtnMomoCheckout />;

    case 'airtel':
      return <AirtelMoneyCheckout />;

    case 'moov':
      return <MoovMoneyCheckout />;

    case 'cmi':
    case 'visa':
    case 'mastercard':
    case 'card_monetique':
    case 'card':
      return <CardCheckout />;

    case 'relay_deposit':
    case 'cashplus':
    case 'wafacash':
      return <RelayDepositCheckout />;

    default:
      // Par défaut pour Orange / Mobile Money
      return <OrangeMoneyCheckout />;
  }
}
