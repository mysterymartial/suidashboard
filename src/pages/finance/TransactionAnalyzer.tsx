import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  Text,
  Button,
  TextField,
  Select,
  Spinner,
  Badge,
  Flex,
} from "@radix-ui/themes";
import CardComponent from "@/components/cards";
import {
  MagnifyingGlassIcon,
  CopyIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import {
  analyzeSuiTransaction,
  formatCurrency,
  formatAddress,
  SUPPORTED_COUNTRIES,
  type AnalyzeResponse,
} from "../../api/transactionAnalyzer";

function TransactionAnalyzer() {
  const [transactionHash, setTransactionHash] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleAnalyze = async () => {
    const trimmedHash = transactionHash.trim();

    if (!trimmedHash) {
      setError("Please enter a transaction hash or address");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeSuiTransaction(trimmedHash, selectedCountry);
      setAnalysisResult(result);
      console.log(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze transaction",
      );
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Layout>
      <main className="p-6 space-y-8">
        {/* Header */}
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            Transaction Analyzer
          </h2>
          <p className="text-[#292929] mt-1">
            Analyze Sui transactions and wallet addresses for tax implications
            and detailed insights.
          </p>
        </CardComponent>

        {/* Input Form */}
        <CardComponent>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              Analyze Transaction
            </h3>
            <div className="space-y-4">
              <div>
                <Text size="2" className="text-[#292929] mb-2 block">
                  Transaction Hash or Address
                </Text>
                <TextField.Root
                  placeholder="Enter Sui transaction hash or wallet address..."
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  className="w-full"
                  size="3"
                />
              </div>

              <div>
                <Text size="2" className="text-[#292929] mb-2 block">
                  Country for Tax Analysis
                </Text>
                <Select.Root
                  value={selectedCountry}
                  onValueChange={setSelectedCountry}
                >
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    {SUPPORTED_COUNTRIES.map((country) => (
                      <Select.Item key={country.value} value={country.value}>
                        {country.flag} {country.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full"
                size="3"
              >
                {isLoading ? (
                  <>
                    <Spinner size="2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="w-4 h-4" />
                    Analyze Transaction
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardComponent>

        {/* Error Display */}
        {error && (
          <CardComponent>
            <div className="p-6">
              <Flex align="center" gap="3" className="text-red-400">
                <ExclamationTriangleIcon className="w-5 h-5" />
                <Text size="3" weight="medium">
                  Error
                </Text>
              </Flex>
              <Text size="2" className="text-red-300 mt-2">
                {error}
              </Text>
            </div>
          </CardComponent>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            <CardComponent>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#292929] mb-4">
                  Analysis Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Text size="2" className="text-[#292929]">
                      Address
                    </Text>
                    <Flex align="center" gap="2" className="mt-1">
                      <Text size="2" className="text-blue-400 font-mono">
                        {formatAddress(analysisResult.address)}
                      </Text>
                      <Button
                        variant="ghost"
                        size="1"
                        onClick={() =>
                          copyToClipboard(analysisResult.address, "address")
                        }
                      >
                        {copiedField === "address" ? (
                          <CheckIcon className="w-3 h-3" />
                        ) : (
                          <CopyIcon className="w-3 h-3" />
                        )}
                      </Button>
                    </Flex>
                  </div>

                  <div>
                    <Text size="2" className="text-[#292929]">
                      Network
                    </Text>
                    <Badge color="blue" variant="soft" className="mt-1">
                      {analysisResult.network.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <Text size="2" className="text-[#292929]">
                      Analysis Type
                    </Text>
                    <Badge color="green" variant="soft" className="mt-1">
                      {analysisResult.analysis_type
                        .replace("_", " ")
                        .toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <Text size="2" className="text-[#292929]">
                      Transactions Analyzed
                    </Text>
                    <Text
                      size="3"
                      weight="bold"
                      className="text-[#292929] mt-1"
                    >
                      {analysisResult.transactions_analyzed}
                    </Text>
                  </div>
                </div>
              </div>
            </CardComponent>

            {/* Tax Summary */}
            <CardComponent>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#292929] mb-4">
                  Tax Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <Text size="2" className="text-[#292929]">
                      Net P&L
                    </Text>
                    <Text
                      size="3"
                      weight="bold"
                      className={`mt-1 ${
                        analysisResult.tax_summary.net_gain_loss >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {formatCurrency(
                        analysisResult.tax_summary.net_gain_loss,
                        analysisResult.tax_summary.currency,
                      )}
                    </Text>
                  </div>

                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <Text size="2" className="text-[#292929]">
                      Total Gas Fees
                    </Text>
                    <Text
                      size="3"
                      weight="bold"
                      className="text-orange-400 mt-1"
                    >
                      {formatCurrency(
                        analysisResult.tax_summary.total_gas_fees,
                        analysisResult.tax_summary.currency,
                      )}
                    </Text>
                  </div>

                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <Text size="2" className="text-[#292929]">
                      Estimated Tax
                    </Text>
                    <Text size="3" weight="bold" className="text-red-400 mt-1">
                      {formatCurrency(
                        analysisResult.tax_summary.estimated_tax,
                        analysisResult.tax_summary.currency,
                      )}
                    </Text>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <Text size="2" className="text-[#292929]">
                      Total Gains
                    </Text>
                    <Text
                      size="3"
                      weight="bold"
                      className="text-green-400 mt-1"
                    >
                      {formatCurrency(
                        analysisResult.tax_summary.total_gains,
                        analysisResult.tax_summary.currency,
                      )}
                    </Text>
                  </div>

                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <Text size="2" className="text-[#292929]">
                      Total Losses
                    </Text>
                    <Text size="3" weight="bold" className="text-red-400 mt-1">
                      {formatCurrency(
                        analysisResult.tax_summary.total_losses,
                        analysisResult.tax_summary.currency,
                      )}
                    </Text>
                  </div>
                </div>
              </div>
            </CardComponent>

            {/* Human Summary */}
            <CardComponent>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#292929] mb-4">
                  Analysis Report
                </h3>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <Text
                    size="3"
                    className="text-[#292929] leading-relaxed whitespace-pre-line"
                  >
                    {analysisResult.human_summary}
                  </Text>
                </div>
              </div>
            </CardComponent>
          </div>
        )}

        {/* Help Section */}
        <CardComponent>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              How to Use
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[#292929] text-sm font-bold">
                  1
                </div>
                <div>
                  <Text size="3" weight="medium" className="text-[#292929]">
                    Enter Transaction Hash or Address
                  </Text>
                  <Text size="2" className="text-[#292929]">
                    Paste the Sui transaction hash or wallet address you want to
                    analyze
                  </Text>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[#292929] text-sm font-bold">
                  2
                </div>
                <div>
                  <Text size="3" weight="medium" className="text-[#292929]">
                    Select Country
                  </Text>
                  <Text size="2" className="text-[#292929]">
                    Choose your country for accurate tax rate calculations
                  </Text>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[#292929] text-sm font-bold">
                  3
                </div>
                <div>
                  <Text size="3" weight="medium" className="text-[#292929]">
                    Analyze
                  </Text>
                  <Text size="2" className="text-[#292929]">
                    Click analyze to get detailed transaction insights and tax
                    implications
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </CardComponent>
      </main>
    </Layout>
  );
}

export default TransactionAnalyzer;
