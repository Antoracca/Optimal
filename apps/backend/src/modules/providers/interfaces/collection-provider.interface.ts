export interface InitiateCollectionParams {
  transferReference: string;
  payerPhoneNumber: string;
  amount: number;
  currency: string;
  countryCode: string;
}

export interface CollectionResult {
  providerTransactionId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  instructions?: string;
  rawResponse?: any;
}

export interface ICollectionProvider {
  initiatePayment(params: InitiateCollectionParams): Promise<CollectionResult>;
  verifyPayment(providerTransactionId: string): Promise<boolean>;
}
