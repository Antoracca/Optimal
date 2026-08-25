export interface InitiatePayoutParams {
  transferReference: string;
  beneficiaryName: string;
  beneficiaryRib: string;
  beneficiaryPhone: string;
  amountMad: number;
  idempotencyKey: string;
}

export interface PayoutResult {
  providerTransferId: string;
  status: 'INITIATED' | 'COMPLETED' | 'REJECTED';
  rawResponse?: any;
}

export interface IPayoutProvider {
  initiateBankTransfer(params: InitiatePayoutParams): Promise<PayoutResult>;
  verifyPayout(providerTransferId: string): Promise<boolean>;
}
