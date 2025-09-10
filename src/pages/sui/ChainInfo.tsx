import { Layout } from "../../components/layout/Layout";
import { useChainInfo } from "../../hooks/useSui/useSuiChainInfo";
import { Text, Spinner, Table } from "@radix-ui/themes";
import CardComponent from "@/components/cards";

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
      .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
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
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

function ChainInfo() {
  const { chainInfo, stakeParam, loading, error } = useChainInfo();

  if (loading) {
    return (
      <Layout>
        <main className="p-6 space-y-8">
          <CardComponent>
            <h2 className="text-2xl font-semibold text-[#292929]">
              Sui - Chain Information
            </h2>
            <p className="text-[#292929] mt-1">View chain information.</p>
          </CardComponent>
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
          <CardComponent>
            <h2 className="text-2xl font-semibold text-[#292929]">
              Sui - Chain Information
            </h2>
            <p className="text-[#292929] mt-1">View chain information.</p>
          </CardComponent>
          <CardComponent>
            <div className="p-6 text-center">
              <Text className="text-red-400">
                Error loading data: {error.message}
              </Text>
            </div>
          </CardComponent>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            Sui - Chain Information
          </h2>
          <p className="text-[#292929] mt-1">View chain information.</p>
        </CardComponent>

        {/* General Parameters */}
        {chainInfo?.generalParametersDto && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                General Parameters
              </h3>
            </div>
            <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Parameter
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Value
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.generalParametersDto).map(
                  ([key, value]) => (
                    <Table.Row key={key}>
                      <Table.Cell>
                        <Text weight="medium" className="text-[#292929]">
                          {formatPropertyName(key)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="text-[#292929] font-mono text-sm">
                          {formatValue(value)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}

        {/* Epoch Parameters */}
        {chainInfo?.epochParametersDto && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Epoch Parameters
              </h3>
            </div>
            <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Parameter
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Value
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.epochParametersDto).map(
                  ([key, value]) => (
                    <Table.Row key={key}>
                      <Table.Cell>
                        <Text weight="medium" className="text-[#292929]">
                          {formatPropertyName(key)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="text-[#292929] font-mono text-sm">
                          {formatValue(value)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}

        {/* Transaction Parameters */}
        {chainInfo?.txParametersDto && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Transaction Parameters
              </h3>
            </div>
            <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Parameter
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Value
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.txParametersDto).map(
                  ([key, value]) => (
                    <Table.Row key={key}>
                      <Table.Cell>
                        <Text weight="medium" className="text-[#292929]">
                          {formatPropertyName(key)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="text-[#292929] font-mono text-sm">
                          {formatValue(value)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}

        {/* Storage Parameters */}
        {chainInfo?.storageParametersDto && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Storage Parameters
              </h3>
            </div>
            <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Parameter
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Value
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.storageParametersDto).map(
                  ([key, value]) => (
                    <Table.Row key={key}>
                      <Table.Cell>
                        <Text weight="medium" className="text-[#292929]">
                          {formatPropertyName(key)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="text-[#292929] font-mono text-sm">
                          {formatValue(value)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}

        {/* Consensus Parameters */}
        {chainInfo?.consensusParametersDto && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Consensus Parameters
              </h3>
            </div>
            <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Parameter
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Value
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.consensusParametersDto).map(
                  ([key, value]) => (
                    <Table.Row key={key}>
                      <Table.Cell>
                        <Text weight="medium" className="text-[#292929]">
                          {formatPropertyName(key)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="text-[#292929] font-mono text-sm">
                          {formatValue(value)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}

        {/* Native Token Parameters */}
        {chainInfo?.nativeTokenParametersDto && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Native Token Parameters
              </h3>
            </div>
            <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Parameter
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Value
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.nativeTokenParametersDto).map(
                  ([key, value]) => (
                    <Table.Row key={key}>
                      <Table.Cell>
                        <Text weight="medium" className="text-[#292929]">
                          {formatPropertyName(key)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="text-[#292929] font-mono text-sm">
                          {formatValue(value)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}

        {/* General Staking Parameters */}
        {stakeParam?.generalStaking && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                General Staking Parameters
              </h3>
            </div>
            <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Parameter
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Value
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(stakeParam.generalStaking).map(
                  ([key, value]) => (
                    <Table.Row key={key}>
                      <Table.Cell>
                        <Text weight="medium" className="text-[#292929]">
                          {formatPropertyName(key)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="text-[#292929] font-mono text-sm">
                          {formatValue(value)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}

        {/* Stake Subsidy Parameters */}
        {stakeParam?.stakeSubsidy && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Stake Subsidy Parameters
              </h3>
            </div>
            <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Parameter
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Value
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(stakeParam.stakeSubsidy).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-[#292929]">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-[#292929] font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}

        {/* Safe Mode Parameters */}
        {chainInfo?.safeModeParametersDto && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Safe Mode Parameters
              </h3>
            </div>
            <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Parameter
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Value
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.safeModeParametersDto).map(
                  ([key, value]) => (
                    <Table.Row key={key}>
                      <Table.Cell>
                        <Text weight="medium" className="text-[#292929]">
                          {formatPropertyName(key)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="text-[#292929] font-mono text-sm">
                          {formatValue(value)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}

        {/* Node Prerequisites */}
        {chainInfo?.nodePrerequisitesParametersDto && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Node Prerequisites
              </h3>
            </div>
            <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Operating System
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Requirements
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.nodePrerequisitesParametersDto).map(
                  ([key, value]) => (
                    <Table.Row key={key}>
                      <Table.Cell>
                        <Text weight="medium" className="text-[#292929]">
                          {formatPropertyName(key)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="text-[#292929] font-mono text-sm">
                          {formatValue(value)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}

        {/* Node Requirements */}
        {chainInfo?.requirementsForNodeParametersDto && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Node Requirements
              </h3>
            </div>
            <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Requirement
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Specification
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(chainInfo.requirementsForNodeParametersDto).map(
                  ([key, value]) => (
                    <Table.Row key={key}>
                      <Table.Cell>
                        <Text weight="medium" className="text-[#292929]">
                          {formatPropertyName(key)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text className="text-[#292929] font-mono text-sm">
                          {formatValue(value)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ),
                )}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}

        {/* Validator Requirements */}
        {chainInfo?.requirementsForValidatorParametersDto && (
          <CardComponent>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-[#292929] mb-4">
                Validator Requirements
              </h3>
            </div>
            <Table.Root className="border border-[#e8e8e8] rounded-[10px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Requirement
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-[#292929]">
                    Specification
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(
                  chainInfo.requirementsForValidatorParametersDto,
                ).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>
                      <Text weight="medium" className="text-[#292929]">
                        {formatPropertyName(key)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text className="text-[#292929] font-mono text-sm">
                        {formatValue(value)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </CardComponent>
        )}
      </main>
    </Layout>
  );
}

export default ChainInfo;
