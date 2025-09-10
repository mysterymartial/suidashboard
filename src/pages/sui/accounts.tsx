import CardComponent from "@/components/cards";
import { Layout } from "../../components/layout/Layout";
import { useSuiAccounts } from "../../hooks/useSui/useSuiAccounts";
import {
  Table,
  Text,
  Avatar,
  Flex,
  Box,
  Spinner,
  Badge,
} from "@radix-ui/themes";

function Accounts() {
  const { accounts, topAccounts, loading } = useSuiAccounts();

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <CardComponent>
            <h2 className="text-2xl font-semibold text-[#292929]">
              Sui - Active Addresses
            </h2>
            <p className="text-[#292929] mt-1">
              Daily/weekly active addresses and trends.
            </p>
          </CardComponent>
          <div className="flex justify-center items-center py-12">
            <Spinner className="text-[#292929]" size="3" />
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            Sui - Active Addresses
          </h2>
          <p className="text-[#292929] mt-1">
            Daily/weekly active addresses and trends.
          </p>
        </CardComponent>

        {/* Top Accounts Table */}
        {topAccounts && topAccounts.length > 0 && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Top Accounts by Balance
              </h3>
            </div>
            <Table.Root className="rounded-[10px] overflow-hidden border border-[#e8e8e8]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Rank
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Account
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Address
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Balance (SUI)
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    NFTs Count
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    First Seen
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Last Seen
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Transactions
                  </Table.ColumnHeaderCell>
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
                          <Text weight="medium" className="text-[#292929]">
                            {account.accountName || "Unknown Account"}
                          </Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" className="text-[#292929] font-mono">
                        {`${account.accountAddress.slice(0, 8)}...${account.accountAddress.slice(-6)}`}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-[#292929] font-medium">
                        {account.balance.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}{" "}
                        SUI
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-[#292929]">
                        {account.nftsСount || "N/A"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" className="text-[#292929]">
                        {account.firstSeen
                          ? new Date(account.firstSeen).toLocaleDateString()
                          : "N/A"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" className="text-[#292929]">
                        {account.lastSeen
                          ? new Date(account.lastSeen).toLocaleDateString()
                          : "N/A"}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-[#292929] font-medium">
                        {account.txsCount
                          ? account.txsCount.toLocaleString()
                          : "N/A"}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}

        {/* All Accounts Table */}
        <CardComponent>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              All Active Addresses ({accounts.length})
            </h3>
          </div>
          <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Rank
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Account
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Address
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Balance (SUI)
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  NFTs Count
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  First Seen
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Last Seen
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Transactions
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {accounts.map((account, index) => (
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
                        <Text weight="medium" className="text-[#292929]">
                          {account.accountName || "Unknown Account"}
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="text-[#292929] font-mono">
                      {`${account.accountAddress.slice(0, 8)}...${account.accountAddress.slice(-6)}`}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929] font-medium">
                      {account.balance.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}{" "}
                      SUI
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {account.nftsСount || "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="text-[#292929]">
                      {account.firstSeen
                        ? new Date(account.firstSeen).toLocaleDateString()
                        : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="text-[#292929]">
                      {account.lastSeen
                        ? new Date(account.lastSeen).toLocaleDateString()
                        : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929] font-medium">
                      {account.txsCount
                        ? account.txsCount.toLocaleString()
                        : "N/A"}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </CardComponent>
      </main>
    </Layout>
  );
}

export default Accounts;
