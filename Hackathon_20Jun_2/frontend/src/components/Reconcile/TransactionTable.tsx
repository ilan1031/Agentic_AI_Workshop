import React from 'react';
import Table, { TableRow, TableCell } from '../ui/Table';
import Badge from '../ui/Badge';
import { FiCheck, FiAlertTriangle, FiX } from 'react-icons/fi';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'matched' | 'unmatched' | 'flagged';
  flags?: string[];
}

interface TransactionTableProps {
  transactions: Transaction[];
  onViewDetails?: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onViewDetails }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched': return <FiCheck className="text-success" />;
      case 'unmatched': return <FiX className="text-secondary" />;
      case 'flagged': return <FiAlertTriangle className="text-warning" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'matched': return 'Matched';
      case 'unmatched': return 'Unmatched';
      case 'flagged': return 'Flagged';
      default: return status;
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Flags</th>
          <th className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.date}</TableCell>
            <TableCell className="fw-medium text-dark">{transaction.description}</TableCell>
            <TableCell>₹{transaction.amount.toLocaleString('en-IN')}</TableCell>
            <TableCell>
              <div className="d-flex align-items-center">
                {getStatusIcon(transaction.status)}
                <span className="ms-2">{getStatusText(transaction.status)}</span>
              </div>
            </TableCell>
            <TableCell>
              {transaction.flags && transaction.flags.length > 0 ? (
                <div className="d-flex flex-wrap gap-1">
                  {transaction.flags.map((flag, index) => (
                    <Badge key={index} variant="danger" className="small">
                      {flag}
                    </Badge>
                  ))}
                </div>
              ) : '-'}
            </TableCell>
            <TableCell className="text-end">
              {onViewDetails && (
                <a className="text-primary fw-medium small ms-2" href="#" onClick={() => onViewDetails(transaction.id)}>View</a>
              )}
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};

export default TransactionTable;