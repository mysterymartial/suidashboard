import { Link } from "react-router";
import { Layout } from "../../components/layout/Layout";
import { useGetCoins } from "../../hooks/useCoins/useGetCoins";
import { Table, Text } from "@radix-ui/themes";
import { Skeleton, TableRowSkeleton } from "../../components/ui/Skeleton";

function AccountCoins() {
  const {
    coins,
    coinCount,
    loading,
    error,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    clearCache,
  } = useGetCoins();

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton height="2rem" width="300px" className="mb-2" />
                <Skeleton height="1rem" width="200px" />
              </div>
              <Skeleton height="2.5rem" width="100px" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Coin
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Symbol
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Price
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Market Cap
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Volume
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Holders
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Verified
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Array.from({ length: 20 }).map((_, index) => (
                  <TableRowSkeleton key={index} columns={7} />
                ))}
              </Table.Body>
            </Table.Root>

            <div className="flex items-center justify-between p-4 border-t border-gray-700">
              <Skeleton height="1rem" width="250px" />
              <div className="flex items-center gap-2">
                <Skeleton height="2rem" width="80px" />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} height="2rem" width="2.5rem" />
                  ))}
                </div>
                <Skeleton height="2rem" width="60px" />
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <Text className="text-red-400">Error: {error.message}</Text>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#292929]">
                Coins - All Coins ({coinCount?.toLocaleString()})
              </h2>
              <p className="text-[#292929] mt-1">
                All available coins on the Sui network. Page {currentPage + 1}{" "}
                of {totalPages}
              </p>
            </div>
            <button
              onClick={() => {
                clearCache();
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 text-[#292929] rounded hover:bg-blue-700 transition-colors"
              title="Refresh data and clear cache"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Coin
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Symbol
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Price
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Market Cap
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Volume
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Holders
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Verified
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {coins?.content?.map((coin: any, index: number) => (
                <Table.Row key={coin.objectId || index}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      {coin.imgUrl && (
                        <img
                          src={coin.imgUrl}
                          alt={coin.coinName}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <div>
                        <Link
                          to={`/coins/coin-details/${encodeURIComponent(coin.coinType)}`}
                          className="hover:underline"
                        >
                          <Text className="text-[#292929] font-medium hover:text-blue-400 cursor-pointer">
                            {coin.coinName}
                          </Text>
                        </Link>
                        <Text className="text-[#292929] text-sm">
                          {coin.coinDenom}
                        </Text>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">{coin.coinSymbol}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {coin.price ? `$${coin.price.toFixed(6)}` : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {coin.marketCap
                        ? `$${coin.marketCap.toLocaleString()}`
                        : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {coin.totalVolume
                        ? `$${coin.totalVolume.toLocaleString()}`
                        : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {coin.holdersCount?.toLocaleString() || "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        coin.isVerified
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {coin.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between p-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <Text className="text-[#292929] text-sm">
                Showing page {currentPage + 1} of {totalPages} (
                {coinCount?.toLocaleString()} total coins)
              </Text>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="px-3 py-1 bg-gray-700 text-[#292929] rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {/* Show page numbers around current page */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (currentPage < 3) {
                    pageNum = i;
                  } else if (currentPage > totalPages - 3) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-1 rounded ${
                        pageNum === currentPage
                          ? "bg-blue-600 text-[#292929]"
                          : "bg-gray-700 text-[#292929] hover:bg-gray-600"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 bg-gray-700 text-[#292929] rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default AccountCoins;
