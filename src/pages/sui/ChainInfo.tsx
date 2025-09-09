import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useChainInfo } from "../../hooks/useSui/useSuiChainInfo";
import { Card, Text, Flex, Box, Spinner, Badge, Table } from "@radix-ui/themes";

// Helper function to format values for display
const formatValue = (value: any): string => {
  if (value === null || value === undefined) return "N/A";
  
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "Empty Array";
    }
    
    // Handle objects by showing key-value pairs in a readable format
    const entries = Object.entries(value);
    if (entries.length === 0) return "Empty Object";
    
    return entries
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
      .join(" | ");
  }
  
  if (typeof value === "string" && value.length > 100) {
    return value.substring(0, 100) + "...";
  }
  
  return String(value);
};

// Helper function to format property names
const formatPropertyName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

function GasUsage() {
  const { chainInfo, stakeParam, loading, error } = useChainInfo()

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold text-white">Sui - Chain Information</h2>
            <p className="text-gray-300 mt-1">
              View chain information.
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <Spinner size="3" />
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
            <h2 className="text-2xl font-semibold text-white">Sui - Gas Usage</h2>
            <p className="text-gray-300 mt-1">
              Monitor gas consumption and cost trends.
            </p>
          </div>
          <Card>
            <div className="p-6 text-center">
              <Text className="text-red-400">Error loading data: {error.message}</Text>
            </div>
          </Card>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">Sui - Gas Usage</h2>
          <p className="text-gray-300 mt-1">
            Monitor gas consumption and cost trends.
          </p>
        </div>

        {/* General Parameters */}
        {chainInfo?.generalParametersDto && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">General Parameters</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">Parameter</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Value</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.generalParametersDto).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-white">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-300 font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}

        {/* Epoch Parameters */}
        {chainInfo?.epochParametersDto && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Epoch Parameters</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">Parameter</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Value</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.epochParametersDto).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-white">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-300 font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}

        {/* Transaction Parameters */}
        {chainInfo?.txParametersDto && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Transaction Parameters</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">Parameter</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Value</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.txParametersDto).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-white">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-300 font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}

        {/* Storage Parameters */}
        {chainInfo?.storageParametersDto && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Storage Parameters</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">Parameter</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Value</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.storageParametersDto).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-white">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-300 font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}

        {/* Consensus Parameters */}
        {chainInfo?.consensusParametersDto && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Consensus Parameters</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">Parameter</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Value</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.consensusParametersDto).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-white">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-300 font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}

        {/* Native Token Parameters */}
        {chainInfo?.nativeTokenParametersDto && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Native Token Parameters</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">Parameter</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Value</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.nativeTokenParametersDto).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-white">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-300 font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}

        {/* General Staking Parameters */}
        {stakeParam?.generalStaking && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">General Staking Parameters</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">Parameter</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Value</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(stakeParam.generalStaking).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-white">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-300 font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}

        {/* Stake Subsidy Parameters */}
        {stakeParam?.stakeSubsidy && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Stake Subsidy Parameters</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">Parameter</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Value</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(stakeParam.stakeSubsidy).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-white">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-300 font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}

        {/* Safe Mode Parameters */}
        {chainInfo?.safeModeParametersDto && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Safe Mode Parameters</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">Parameter</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Value</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.safeModeParametersDto).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-white">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-300 font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}

        {/* Node Prerequisites */}
        {chainInfo?.nodePrerequisitesParametersDto && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Node Prerequisites</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">Operating System</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Requirements</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.nodePrerequisitesParametersDto).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-white">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-300 font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}

        {/* Node Requirements */}
        {chainInfo?.requirementsForNodeParametersDto && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Node Requirements</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">Requirement</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Specification</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.requirementsForNodeParametersDto).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-white">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-300 font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}

        {/* Validator Requirements */}
        {chainInfo?.requirementsForValidatorParametersDto && (
          <Card>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-4">Validator Requirements</h3>
            </div>
            <Table.Root variant="surface" className="rounded-xl overflow-hidden">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-white">Requirement</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-white">Specification</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.requirementsForValidatorParametersDto).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-white">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-gray-300 font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>
        )}
      </main>
    </Layout>
  );
}

export default GasUsage;
