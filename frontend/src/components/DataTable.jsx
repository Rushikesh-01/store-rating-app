import { ChevronUp, ChevronDown } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const DataTable = ({ columns, data, sortBy, sortOrder, onSort, page, totalPages, onPageChange, loading, emptyMessage }) => {
  return (
    <div className="card animate-fade-in">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.sortable ? 'cursor-pointer hover:bg-dark-800/80 transition-colors' : ''}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortBy === col.key && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-primary-400" /> : <ChevronDown className="w-3 h-3 text-primary-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} className="text-center py-10"><LoadingSpinner /></td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center py-10 text-dark-500">{emptyMessage || 'No data found.'}</td></tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id || i}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {!loading && totalPages > 1 && (
        <div className="card-body flex items-center justify-between border-t border-dark-800">
          <p className="text-sm text-dark-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="btn-secondary btn-sm">Previous</button>
            <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="btn-secondary btn-sm">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DataTable;
