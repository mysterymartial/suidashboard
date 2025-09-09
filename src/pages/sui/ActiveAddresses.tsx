import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useSuiAccounts } from "../../hooks/useSui/useSuiAccounts";
import { Table, Card, Text, Avatar, Flex, Box, Spinner, Badge } from "@radix-ui/themes";

function ActiveAddresses() {

  const {accounts, topAccounts, loading, error } = useSuiAccounts()

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">
              Sui - Active Addresses
            </h2>
            <p className="text-gray-300 mt-1">
              Daily/weekly active addresses and trends.
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <Spinner size="3" />
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            Sui - Active Addresses
          </h2>
          <p className="text-gray-300 mt-1">
            Daily/weekly active addresses and trends.
          </p>
        </div>

        {/* Top Accounts Table */}
        {topAccounts && topAccounts.length > 0 && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Top Accounts by Balance</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                   <Table.ColumnHeaderCell className="text-white">Rank</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell className="text-white">Account</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell className="text-white">Address</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell className="text-white">Balance (SUI)</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell className="text-white">NFTs Count</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell className="text-white">First Seen</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell className="text-white">Last Seen</Table.ColumnHeaderCell>
                   <Table.ColumnHeaderCell className="text-white">Transactions</Table.ColumnHeaderCell>
                 </Table.Row>
              </Table.Header>
              <Table.Body>
                {topAccounts.map((account, index) => (
                  <Table.Row key={account.accountAddress}>
                    <Table.Cell>
                      <Badge color="blue" variant="soft">
                        #{index + 1}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="3">
                        <Avatar 
                          src={account.accountImg} 
                          fallback={account.accountName?.[0] || "A"} 
                          size="2" 
                        />
                        <Box>
                          <Text weight="medium" className="text-white">
                            {account.accountName || "Unknown Account"}
                          </Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" className="text-blue-400 font-mono">
                        {`${account.accountAddress.slice(0, 8)}...${account.accountAddress.slice(-6)}`}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-white font-medium">
                        {account.balance.toLocaleString(undefined, {maximumFractionDigits: 2})} SUI
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                       <Text className="text-gray-300">
                         {account.nftsСount || "N/A"}
                       </Text>
                     </Table.Cell>
                     <Table.Cell>
                       <Text size="2" className="text-gray-300">
                         {account.firstSeen ? new Date(account.firstSeen).toLocaleDateString() : "N/A"}
                       </Text>
                     </Table.Cell>
                     <Table.Cell>
                       <Text size="2" className="text-gray-300">
                         {account.lastSeen ? new Date(account.lastSeen).toLocaleDateString() : "N/A"}
                       </Text>
                     </Table.Cell>
                     <Table.Cell>
                       <Text className="text-white font-medium">
                         {account.txsCount ? account.txsCount.toLocaleString() : "N/A"}
                       </Text>
                     </Table.Cell>
                   </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}

        {/* All Accounts Table */}
        <Card>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-4">All Active Addresses ({accounts.length})</h3>
          </div>
          <Table.Root variant="surface" className="rounded-xl overflow-hidden">
            <Table.Header>
              <Table.Row>
                 <Table.ColumnHeaderCell className="text-white">Rank</Table.ColumnHeaderCell>
                 <Table.ColumnHeaderCell className="text-white">Account</Table.ColumnHeaderCell>
                 <Table.ColumnHeaderCell className="text-white">Address</Table.ColumnHeaderCell>
                 <Table.ColumnHeaderCell className="text-white">Balance (SUI)</Table.ColumnHeaderCell>
                 <Table.ColumnHeaderCell className="text-white">NFTs Count</Table.ColumnHeaderCell>
                 <Table.ColumnHeaderCell className="text-white">First Seen</Table.ColumnHeaderCell>
                 <Table.ColumnHeaderCell className="text-white">Last Seen</Table.ColumnHeaderCell>
                 <Table.ColumnHeaderCell className="text-white">Transactions</Table.ColumnHeaderCell>
               </Table.Row>
            </Table.Header>
            <Table.Body>
              {accounts.map((account, index) => (
                <Table.Row key={account.accountAddress}>
                  <Table.Cell>
                    <Badge color="gray" variant="soft">
                      #{index + 1}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      <Avatar 
                        src={account.accountImg} 
                        fallback={account.accountName?.[0] || "A"} 
                        size="2" 
                      />
                      <Box>
                        <Text weight="medium" className="text-white">
                          {account.accountName || "Unknown Account"}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="text-blue-400 font-mono">
                      {`${account.accountAddress.slice(0, 8)}...${account.accountAddress.slice(-6)}`}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white font-medium">
                      {account.balance.toLocaleString(undefined, {maximumFractionDigits: 2})} SUI
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                     <Text className="text-gray-300">
                       {account.nftsСount || "N/A"}
                     </Text>
                   </Table.Cell>
                   <Table.Cell>
                     <Text size="2" className="text-gray-300">
                       {account.firstSeen ? new Date(account.firstSeen).toLocaleDateString() : "N/A"}
                     </Text>
                   </Table.Cell>
                   <Table.Cell>
                     <Text size="2" className="text-gray-300">
                       {account.lastSeen ? new Date(account.lastSeen).toLocaleDateString() : "N/A"}
                     </Text>
                   </Table.Cell>
                   <Table.Cell>
                     <Text className="text-white font-medium">
                       {account.txsCount ? account.txsCount.toLocaleString() : "N/A"}
                     </Text>
                   </Table.Cell>
                 </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
      </main>
    </Layout>
  );
}

export default ActiveAddresses;
