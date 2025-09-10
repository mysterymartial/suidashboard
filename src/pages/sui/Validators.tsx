import React, { useEffect } from "react";
import { Layout } from "../../components/layout/Layout";
import { useSuiValidators } from "../../hooks/useSui/useSuiValidators";
import {
  Table,
  Text,
  Avatar,
  Flex,
  Box,
  Spinner,
  Badge,
  Link,
} from "@radix-ui/themes";
import CardComponent from "@/components/cards";

function SuiValidators() {
  const { validators, validatorsApy, loading, fetchValidators } =
    useSuiValidators();

  useEffect(() => {
    fetchValidators();
  }, []);

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <CardComponent>
            <h2 className="text-2xl font-semibold text-[#292929]">
              Sui - Validators
            </h2>
            <p className="text-[#292929] mt-1">
              High-level network validators and health metrics.
            </p>
          </CardComponent>
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
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            Sui - Validators
          </h2>
          <p className="text-[#292929] mt-1">
            High-level network performance and health metrics.
          </p>
        </CardComponent>

        {/* Network Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardComponent>
            <div className="flex flex-col justify-between h-full">
              <Text size="2" className="text-[#292929]">
                Total Validators
              </Text>
              <Text weight="bold" className="text-[#292929] text-[1.7rem]">
                {validators.length}
              </Text>
            </div>
          </CardComponent>
          <CardComponent>
            <div className="flex flex-col justify-between h-full">
              <Text size="2" className="text-[#292929]">
                Average APY
              </Text>
              <Text weight="bold" className="text-green-400 text-[1.7rem]">
                {validatorsApy ? `${validatorsApy.toFixed(2)}%` : "N/A"}
              </Text>
            </div>
          </CardComponent>
          <CardComponent>
            <div className="flex flex-col justify-between h-[100px]">
              <Text size="2" className="text-[#292929]">
                Total Stake
              </Text>
              <Text size="6" weight="bold" className="text-[#292929]">
                {validators
                  .reduce((sum, v) => sum + (v.stakeAmount || 0), 0)
                  .toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
                SUI
              </Text>
            </div>
          </CardComponent>
          <CardComponent>
            <div className="flex flex-col justify-between h-full">
              <Text size="2" className="text-[#292929]">
                Verified Validators
              </Text>
              <Text weight="bold" className="text-[#292929] text-[1.7rem]">
                {validators.filter((v) => v.isVerified).length}
              </Text>
            </div>
          </CardComponent>
        </div>

        {/* Validators Table */}
        <CardComponent>
          <div className="">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              Top Validators ({validators.length})
            </h3>
          </div>
          <Table.Root className="rounded-[10px] overflow-hidden border border-[#e8e8e8]">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Validator
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Address
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  APY
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Commission
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Stake Amount
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Status
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-[#292929]">
                  Social
                </Table.ColumnHeaderCell>
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
                        <Text weight="medium" className="text-[#292929]">
                          {validator.validatorName || "Unknown Validator"}
                        </Text>
                        {/* <Text size="1" className="text-[#292929]">
                          {validator.description ? 
                            (validator.description.length > 50 ? 
                              `${validator.description.slice(0, 50)}...` : 
                              validator.description
                            ) : "No description"
                          }
                        </Text> */}
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="text-[#292929] font-mono">
                      {`${validator.validatorAddress.slice(0, 8)}...${validator.validatorAddress.slice(-6)}`}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-green-400 font-medium">
                      {validator.apy ? `${validator.apy.toFixed(2)}%` : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929]">
                      {validator.commissionRate
                        ? `${validator.commissionRate}%`
                        : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text className="text-[#292929] font-medium">
                      {validator.stakeAmount
                        ? `${validator.stakeAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} SUI`
                        : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={validator.isVerified ? "green" : "red"}
                      variant="soft"
                    >
                      {validator.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      {validator.socialWebsite && (
                        <Link href={validator.socialWebsite} target="_blank">
                          <Badge color="blue" variant="soft" size="1">
                            Website
                          </Badge>
                        </Link>
                      )}
                      {validator.socialTwitter && (
                        <Link href={validator.socialTwitter} target="_blank">
                          <Badge color="cyan" variant="soft" size="1">
                            Twitter
                          </Badge>
                        </Link>
                      )}
                      {validator.socialTelegram && (
                        <Link href={validator.socialTelegram} target="_blank">
                          <Badge color="purple" variant="soft" size="1">
                            Telegram
                          </Badge>
                        </Link>
                      )}
                    </Flex>
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

export default SuiValidators;
