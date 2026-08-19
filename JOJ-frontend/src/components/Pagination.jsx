export default function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 ${ currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
        &lt;
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button key={page} onClick={() => onPageChange(page)}className={`w-8 h-8 flex items-center justify-center rounded-full ${currentPage === page ? 'bg-orange-500 text-white font-bold' : 'border border-gray-300 hover:bg-gray-100 text-gray-700'}`}>
          {page}
        </button>
      ))}

      <button onClick={() => onPageChange(currentPage + 1)}disabled={currentPage === totalPages}className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
        &gt;
      </button>
    </div>
  );
}