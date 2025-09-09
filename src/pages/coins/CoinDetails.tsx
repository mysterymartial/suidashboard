import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Layout } from "../../components/layout/Layout";
import { useCoinMeta } from "../../hooks/useCoins/useCoinMeta";
import { Card, Flex, Text, Heading, Table, Badge, Link, Skeleton, TextField, Button } from "@radix-ui/themes";
import { ExternalLink, Github, MessageCircle, Twitter, AlertTriangle, Search } from "lucide-react";

function CoinDetails() {
  const { coinType } = useParams<{ coinType: string }>();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const { coinMeta, loading, error } = useCoinMeta(coinType);

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/coins/coin-details/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // If no coinType is provided, show search interface
  if (!coinType) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <Card className="p-8">
            <Flex direction="column" align="center" gap="6">
              <Heading size="6">Search Coin Details</Heading>
              <Text color="gray" size="3" className="text-center max-w-md">
                Enter a coin type to view detailed information. Examples:
                <br />• 0x2::sui::SUI
                <br />• 0x1d4a2bdbc1602a0adaa98194942c220202dcc56bb0a205838dfaa63db0d5497e::SAIL::SAIL
              </Text>
              <Flex gap="3" className="w-full max-w-md">
                <TextField.Root 
                  placeholder="Enter coin type (e.g., 0x2::sui::SUI)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={!searchInput.trim()}>
                  <Search size={16} />
                  Search
                </Button>
              </Flex>
            </Flex>
          </Card>
        </main>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <Card className="p-6">
            <Flex direction="column" gap="4">
              <Skeleton height="2rem" width="300px" />
              <Skeleton height="1rem" width="200px" />
            </Flex>
          </Card>
          <Card className="p-6">
            <Flex direction="column" gap="3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Flex key={i} justify="between">
                  <Skeleton height="1rem" width="120px" />
                  <Skeleton height="1rem" width="180px" />
                </Flex>
              ))}
            </Flex>
          </Card>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <Card className="p-6">
            <Flex align="center" gap="2">
              <AlertTriangle className="text-red-500" size={20} />
              <Text color="red">Error: {error.message}</Text>
            </Flex>
          </Card>
        </main>
      </Layout>
    );
  }

  if (!coinMeta) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <Card className="p-6">
            <Text>No coin data available</Text>
          </Card>
        </main>
      </Layout>
    );
  }

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined || isNaN(num)) return 'N/A';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toLocaleString();
  };

  return (
    <Layout>
      <main className="p-6 space-y-8">
        {/* Header */}
        <Card className="p-6">
          <Flex align="center" gap="4">
            {coinMeta.imgUrl && (
              <img 
                src={coinMeta.imgUrl.trim()} 
                alt={coinMeta.coinName} 
                className="w-16 h-16 rounded-full"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <Flex direction="column" gap="1">
              <Heading size="6">{coinMeta.coinName} ({coinMeta.coinSymbol})</Heading>
              <Text color="gray" size="2">{coinMeta.coinType}</Text>
              {coinMeta.description && (
                <Text size="3" className="mt-2">{coinMeta.description}</Text>
              )}
            </Flex>
          </Flex>
        </Card>

        {/* Main Information */}
        <Card className="p-6">
          <Heading size="4" className="mb-4">Coin Information</Heading>
          <Table.Root>
            <Table.Body>
              <Table.Row>
                <Table.Cell><Text weight="medium">Decimals</Text></Table.Cell>
                <Table.Cell><Text>{coinMeta.decimals}</Text></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Text weight="medium">Total Supply</Text></Table.Cell>
                <Table.Cell><Text>{formatNumber(coinMeta.totalSupply)}</Text></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Text weight="medium">Circulating Supply</Text></Table.Cell>
                <Table.Cell><Text>{formatNumber(coinMeta.circulatingSupply)}</Text></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Text weight="medium">Market Cap</Text></Table.Cell>
                <Table.Cell><Text>${formatNumber(coinMeta.marketCap)}</Text></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Text weight="medium">Volume (24h)</Text></Table.Cell>
                <Table.Cell><Text>${formatNumber(coinMeta.volume)}</Text></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Card>

        {/* Social Links */}
        {(coinMeta.socialDiscord || coinMeta.socialGitHub || coinMeta.socialTwitter || coinMeta.socialWebsite) && (
          <Card className="p-6">
            <Heading size="4" className="mb-4">Social Links</Heading>
            <Flex gap="3" wrap="wrap">
              {coinMeta.socialDiscord && (
                <Link href={coinMeta.socialDiscord.trim()} target="_blank">
                  <Badge variant="soft" size="2">
                    <MessageCircle size={14} className="mr-1" />
                    Discord
                  </Badge>
                </Link>
              )}
              {coinMeta.socialGitHub && (
                <Link href={coinMeta.socialGitHub.trim()} target="_blank">
                  <Badge variant="soft" size="2">
                    <Github size={14} className="mr-1" />
                    GitHub
                  </Badge>
                </Link>
              )}
              {coinMeta.socialTwitter && (
                <Link href={coinMeta.socialTwitter.trim()} target="_blank">
                  <Badge variant="soft" size="2">
                    <Twitter size={14} className="mr-1" />
                    Twitter
                  </Badge>
                </Link>
              )}
              {coinMeta.socialWebsite && (
                <Link href={coinMeta.socialWebsite.trim()} target="_blank">
                  <Badge variant="soft" size="2">
                    <ExternalLink size={14} className="mr-1" />
                    Website
                  </Badge>
                </Link>
              )}
            </Flex>
          </Card>
        )}

        {/* Security Message */}
        {coinMeta.securityMessage && (
          <Card className="p-6 border-yellow-500">
            <Flex align="center" gap="2">
              <AlertTriangle className="text-yellow-500" size={20} />
              <Text color="yellow" weight="medium">Security Notice</Text>
            </Flex>
            <Text className="mt-2">{coinMeta.securityMessage}</Text>
          </Card>
        )}
      </main>
    </Layout>
  );
}

export default CoinDetails;
