import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AssetTable = ({
  coin,
  category,
  onCoinSelect,
  selectedCoinId,
  onPageChange,
  currentBackendPage,
  error,            // Pass any error from parent
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 9;

  // Reset to page 1 on category or backend page change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, currentBackendPage]);

  // Calculate total pages (at least 1 to keep pagination)
  const totalPages = Math.max(1, Math.ceil((coin?.length || 0) / coinsPerPage));
  const startIndex = (currentPage - 1) * coinsPerPage;
  const endIndex = startIndex + coinsPerPage;
  const currentCoins = coin?.slice(startIndex, endIndex) || [];

  // Pagination controls remain active even if error
  const canGoPrev = (currentPage > 1) || (category === "all" && currentBackendPage > 1);
  const canGoNext = true; // Always allow Next, let backend handle no data

  const handleRowClick = (item) => {
    if (onCoinSelect) onCoinSelect(item);
  };

  const handleCoinImageClick = (item, e) => {
    e.stopPropagation();
    navigate(`/market/${item.id}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
      return;
    }
    if (category === "all" && currentBackendPage > 1) {
      onPageChange && onPageChange(currentBackendPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
      return;
    }
    if (category === "all") {
      onPageChange && onPageChange(currentBackendPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      if (startPage > 2) pages.push("...");
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-800 text-white p-2 rounded text-center">
          Error loading data. Please try again later.
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">COIN</TableHead>
            <TableHead>SYMBOL</TableHead>
            <TableHead>VOLUME</TableHead>
            <TableHead>MARKET CAP</TableHead>
            <TableHead>24H</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentCoins.map((item) => (
            <TableRow
              key={item.id}
              onClick={() => handleRowClick(item)}
              className={`cursor-pointer transition-colors ${
                selectedCoinId === item.id
                  ? "bg-slate-800 hover:bg-slate-800"
                  : "hover:bg-slate-900"
              }`}
            >
              <TableCell className="font-medium">
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => handleCoinImageClick(item, e)}
                >
                  <Avatar>
                    <AvatarImage src={item.image} />
                  </Avatar>
                  <span>{item.name}</span>
                </div>
              </TableCell>
              <TableCell className="uppercase">{item.symbol}</TableCell>
              <TableCell>${item.total_volume?.toLocaleString()}</TableCell>
              <TableCell>${item.market_cap?.toLocaleString()}</TableCell>
              <TableCell
                className={
                  item.price_change_percentage_24h >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {item.price_change_percentage_24h >= 0 ? "+" : ""}
                {item.price_change_percentage_24h?.toFixed(2)}%
              </TableCell>
              <TableCell className="text-right">
                ${item.current_price?.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousPage}
              disabled={!canGoPrev}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={i} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <Button
                    key={i}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageClick(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={!canGoNext}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {category === "all" && currentBackendPage && (
        <div className="text-center text-xs text-gray-500 mt-2">
          Backend Page: {currentBackendPage}
        </div>
      )}
    </div>
  );
};

export default AssetTable;
