export type IncompleteReason = 'missing_phone' | 'invalid_phone';

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  year: string;
  phone: string;
  /** True when this record has data quality issues and must not appear in public matches. */
  incomplete?: boolean;
  /** Explains why the record is flagged. */
  incompleteReasons?: IncompleteReason[];
  /** Admin note explaining the issue. */
  adminNote?: string;
}
