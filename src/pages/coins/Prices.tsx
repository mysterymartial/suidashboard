import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useCoinTrend } from "../../hooks/useCoins/useCoinTrend";
import { Card, Flex, Text, Heading, Table, Badge, Skeleton, Button } from "@radix-ui/themes";
import { RefreshCw, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

function Prices() {
  const { trendingCoins, loading, error, refetch } = useCoinTrend();

  const formatNumber = (num: string | number | null | undefined) => {
    if (!num || num === 'NaN' || isNaN(Number(num))) return 'N/A';
    const numValue = Number(num);
    if (numValue >= 1e9) return (numValue / 1e9).toFixed(2) + 'B';
    if (numValue >= 1e6) return (numValue / 1e6).toFixed(2) + 'M';
    if (numValue >= 1e3) return (numValue / 1e3).toFixed(2) + 'K';
    return numValue.toLocaleString();
  };

  const formatPrice = (price: string | number) => {
    if (!price || price === 'NaN' || isNaN(Number(price))) return 'N/A';
    const numPrice = Number(price);
    if (numPrice < 0.01) return numPrice.toFixed(6);
    if (numPrice < 1) return numPrice.toFixed(4);
    return numPrice.toFixed(2);
  };

  const formatPercentage = (percentage: string | number) => {
    if (!percentage || percentage === 'NaN' || isNaN(Number(percentage))) return 'N/A';
    const numPercentage = Number(percentage);
    return numPercentage.toFixed(2) + '%';
  };

  const getPercentageColor = (percentage: string | number) => {
    if (!percentage || percentage === 'NaN' || isNaN(Number(percentage))) return 'gray';
    const numPercentage = Number(percentage);
    return numPercentage >= 0 ? 'green' : 'red';
  };

  const getPercentageIcon = (percentage: string | number) => {
    if (!percentage || percentage === 'NaN' || isNaN(Number(percentage))) return null;
    const numPercentage = Number(percentage);
    return numPercentage >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />;
  };

  if (error) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <Card className="p-6">
            <Flex align="center" gap="2">
              <AlertTriangle className="text-red-500" size={20} />
              <Text color="red">Error: {error.message}</Text>
              <Button onClick={refetch} variant="soft" size="2">
                <RefreshCw size={16} />
                Retry
              </Button>
            </Flex>
          </Card>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="p-6 space-y-8">
        {/* Header */}
        <Card className="p-6">
          <Flex justify="between" align="center">
            <div>
              <Heading size="6">Trending Coins</Heading>
              <Text color="gray" size="3">
                Real-time trending cryptocurrency data with price movements and volume metrics.
              </Text>
            </div>
            <Button onClick={refetch} variant="soft" size="2" disabled={loading}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </Flex>
        </Card>

        {/* Trending Coins Table */}
        <Card className="p-6">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Token</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Market Cap</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>24h Volume</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>1h Change</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>24h Change</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Holders</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Liquidity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>24h Traders</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading ? (
                // Skeleton loading rows
                Array.from({ length: 10 }).map((_, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Flex align="center" gap="3">
                        <Skeleton width="40px" height="40px" style={{ borderRadius: '50%' }} />
                        <div>
                          <Skeleton width="80px" height="16px" />
                          <Skeleton width="60px" height="12px" style={{ marginTop: '4px' }} />
                        </div>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell><Skeleton width="100px" height="16px" /></Table.Cell>
                    <Table.Cell><Skeleton width="120px" height="16px" /></Table.Cell>
                    <Table.Cell><Skeleton width="100px" height="16px" /></Table.Cell>
                    <Table.Cell><Skeleton width="80px" height="16px" /></Table.Cell>
                    <Table.Cell><Skeleton width="80px" height="16px" /></Table.Cell>
                    <Table.Cell><Skeleton width="80px" height="16px" /></Table.Cell>
                    <Table.Cell><Skeleton width="100px" height="16px" /></Table.Cell>
                    <Table.Cell><Skeleton width="80px" height="16px" /></Table.Cell>
                  </Table.Row>
                ))
              ) : (
                trendingCoins.map((coin, index) => (
                  <Table.Row key={coin.coin || index}>
                    <Table.Cell>
                      <Flex align="center" gap="3">
                        <img 
                          src={coin.coinMetadata?.iconUrl || '/placeholder-coin.png'} 
                          alt={coin.coinMetadata?.symbol || 'Unknown'}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-coin.png';
                          }}
                        />
                        <div>
                          <Text weight="medium">{coin.coinMetadata?.name || 'Unknown Token'}</Text>
                          <Text size="2" color="gray">{coin.coinMetadata?.symbol || 'N/A'}</Text>
                        </div>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Text weight="medium">${formatPrice(coin.price)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>${formatNumber(coin.marketCap)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>${formatNumber(coin.buyVolumeStats1d?.volumeUsd + coin.sellVolumeStats1d?.volumeUsd || 0)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={getPercentageColor(coin.percentagePriceChange1h)} variant="soft">
                        <Flex align="center" gap="1">
                          {getPercentageIcon(coin.percentagePriceChange1h)}
                          {formatPercentage(coin.percentagePriceChange1h)}
                        </Flex>
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={getPercentageColor(coin.percentagePriceChange1d)} variant="soft">
                        <Flex align="center" gap="1">
                          {getPercentageIcon(coin.percentagePriceChange1d)}
                          {formatPercentage(coin.percentagePriceChange1d)}
                        </Flex>
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{formatNumber(coin.holdersCount)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>${formatNumber(coin.totalLiquidityUsd)}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{formatNumber(coin.uniqueTraders1d)}</Text>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
          
          {!loading && trendingCoins.length === 0 && (
            <Flex justify="center" align="center" className="py-8">
              <Text color="gray">No trending coins data available</Text>
            </Flex>
          )}
        </Card>
      </main>
    </Layout>
  );
}

export default Prices;
