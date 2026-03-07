/**
 * Masks bank account number for public display.
 * Shows last 4 digits: XXXXXX1234
 */
export function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber || accountNumber.length < 4) return '****';
  const last4 = accountNumber.slice(-4);
  return `XXXXXX${last4}`;
}
