// export interface Transaction {
//   id: string;
//   date: string;
//   reference: string;
//   counterparty: string;
//   amount: number;
//   status: 'Completed' | 'Pending' | 'Failed';
//   category: string;
//   narration: string;
// }

export type TransactionFormData = Omit<Transaction, 'id'>;

export interface TransactionFilters {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  searchTerm: string;
}

export interface category {
  "id": string,
  "name": string,
  "created_at": string,

}
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  category: category[];
  merchant: string;
  status: 'pending' | 'completed' | 'failed';
  type: 'income' | 'expense';
}

export interface TransactionsResponse {
  data: Transaction[];
  meta: {
    totalItems: number,
    totalPages: number,
    currentPage: number,
    itemsPerPage: number,
  },
}
