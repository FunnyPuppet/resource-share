import React from 'react';

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // 计算显示页码区间
    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5
        const half = Math.floor(maxVisible / 2)

        let start = Math.max(1, currentPage - half)
        let end = Math.min(totalPages, currentPage + half)

        // 边缘情况处理
        if (currentPage <= half) {
            end = Math.min(totalPages, maxVisible)
        }
        if (currentPage + half > totalPages) {
            start = Math.max(1, totalPages - maxVisible + 1)
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        return pages
    }

    const pages = getPageNumbers();

    return (
        <div className="flex items-center justify-center space-x-2">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={`px-3 py-1 border rounded ${currentPage === 1
                    ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                    }`}
            >
                ←
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 border rounded ${page === currentPage
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'hover:bg-gray-100'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`px-3 py-1 border rounded ${currentPage === totalPages
                    ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                    }`}
            >
                →
            </button>
        </div>
    );
}
