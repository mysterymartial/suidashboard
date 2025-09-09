import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useSuiValidators } from "../../hooks/useSui/useSuiValidators";
import { Table, Card, Text, Avatar, Flex, Box, Spinner, Badge, Link } from "@radix-ui/themes";

function NetworkStats() {

  const { validators, validatorsApy, loading } = useSuiValidators()

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">
              Sui - Validators
            </h2>
            <p className="text-gray-300 mt-1">
              High-level network validators and health metrics.
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
            Sui - Network Stats
          </h2>
          <p className="text-gray-300 mt-1">
            High-level network performance and health metrics.
          </p>
        </div>

        {/* Network Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="p-4">
              <Text size="2" className="text-gray-400">Total Validators</Text>
              <Text size="6" weight="bold" className="text-white">{validators.length}</Text>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <Text size="2" className="text-gray-400">Average APY</Text>
              <Text size="6" weight="bold" className="text-green-400">
                {validatorsApy ? `${validatorsApy.toFixed(2)}%` : "N/A"}
              </Text>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <Text size="2" className="text-gray-400">Total Stake</Text>
              <Text size="6" weight="bold" className="text-blue-400">
                {validators.reduce((sum, v) => sum + (v.stakeAmount || 0), 0).toLocaleString(undefined, {maximumFractionDigits: 0})} SUI
              </Text>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <Text size="2" className="text-gray-400">Verified Validators</Text>
              <Text size="6" weight="bold" className="text-purple-400">
                {validators.filter(v => v.isVerified).length}
              </Text>
            </div>
          </Card>
        </div>



        {/* Validators Table */}
        <Card>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-4">Validators ({validators.length})</h3>
          </div>
          <Table.Root variant="surface" className="rounded-xl overflow-hidden">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-white">Validator</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Address</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">APY</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Commission</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Stake Amount</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-white">Social</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {validators.map((validator, index) => (
                <Table.Row key={validator.validatorAddress}>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      <Avatar 
                        src={validator.validatorImg} 
                        fallback={validator.validatorName?.[0] || "V"} 
                        size="2" 
                      />
                      <Box>
                        <Text weight="medium" className="text-white">
                          {validator.validatorName || "Unknown Validator"}
                        </Text>
                        <Text size="1" className="text-gray-400">
                          {validator.description ? 
                            (validator.description.length > 50 ? 
                              `${validator.description.slice(0, 50)}...` : 
                              validator.description
                            ) : "No description"
                          }
                        </Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="text-blue-400 font-mono">
                      {`${validator.validatorAddress.slice(0, 8)}...${validator.validatorAddress.slice(-6)}`}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-green-400 font-medium">
                      {validator.apy ? `${validator.apy.toFixed(2)}%` : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white">
                      {validator.commissionRate ? `${validator.commissionRate}%` : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-white font-medium">
                      {validator.stakeAmount ? 
                        `${validator.stakeAmount.toLocaleString(undefined, {maximumFractionDigits: 0})} SUI` : 
                        "N/A"
                      }
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge 
                      color={validator.isVerified ? "green" : "gray"} 
                      variant="soft"
                    >
                      {validator.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      {validator.socialWebsite && (
                        <Link href={validator.socialWebsite} target="_blank">
                          <Badge color="blue" variant="soft" size="1">Website</Badge>
                        </Link>
                      )}
                      {validator.socialTwitter && (
                        <Link href={validator.socialTwitter} target="_blank">
                          <Badge color="cyan" variant="soft" size="1">Twitter</Badge>
                        </Link>
                      )}
                      {validator.socialTelegram && (
                        <Link href={validator.socialTelegram} target="_blank">
                          <Badge color="purple" variant="soft" size="1">Telegram</Badge>
                        </Link>
                      )}
                    </Flex>
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

export default NetworkStats;
