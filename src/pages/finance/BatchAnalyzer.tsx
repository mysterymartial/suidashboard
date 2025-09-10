import React, { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  Card,
  Text,
  Button,
  TextField,
  Select,
  Spinner,
  Badge,
  Flex,
  Box,
  Separator,
} from "@radix-ui/themes";
import {
  UploadIcon,
  DownloadIcon,
  TrashIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

// Country options for tax analysis
const countries = [
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "SG", label: "Singapore" },
  { value: "CH", label: "Switzerland" },
  { value: "NL", label: "Netherlands" },
];

interface TransactionInput {
  id: string;
  hash: string;
  description?: string;
}

function BatchAnalyzer() {
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [transactions, setTransactions] = useState<TransactionInput[]>([
    { id: "1", hash: "", description: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addTransaction = () => {
    const newId = (transactions.length + 1).toString();
    setTransactions([
      ...transactions,
      { id: newId, hash: "", description: "" },
    ]);
  };

  const removeTransaction = (id: string) => {
    if (transactions.length > 1) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const updateTransaction = (
    id: string,
    field: keyof TransactionInput,
    value: string,
  ) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const handleAnalyze = async () => {
    const validTransactions = transactions.filter((t) => t.hash.trim());
    if (validTransactions.length === 0) {
      alert("Please enter at least one transaction hash");
      return;
    }

    setIsLoading(true);
    // Simulate batch analysis
    setTimeout(() => {
      setResults(
        validTransactions.map((t) => ({
          hash: t.hash,
          description: t.description,
          amount: Math.random() * 1000,
          currency: "SUI",
          estimatedTax: Math.random() * 100,
          status: "completed",
        })),
      );
      setIsLoading(false);
    }, 2000);
  };

  const exportResults = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Hash,Description,Amount,Currency,Estimated Tax,Status\n" +
      results
        .map(
          (r) =>
            `${r.hash},${r.description},${r.amount},${r.currency},${r.estimatedTax},${r.status}`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transaction_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <main className="p-6 space-y-8">
        {/* Header */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#292929]">
            Batch Transaction Analyzer
          </h2>
          <p className="text-[#292929] mt-1">
            Analyze multiple Sui transactions simultaneously for comprehensive
            tax reporting.
          </p>
        </div>

        {/* Input Section */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#292929]">
                Transaction Inputs
              </h3>
              <div className="flex gap-2">
                <Button onClick={addTransaction} size="2" variant="outline">
                  <PlusIcon className="w-4 h-4" />
                  Add Transaction
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <Text size="2" className="text-[#292929] mb-2 block">
                Country for Tax Analysis
              </Text>
              <Select.Root
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <Select.Trigger className="w-full md:w-64" />
                <Select.Content>
                  {countries.map((country) => (
                    <Select.Item key={country.value} value={country.value}>
                      {country.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>

            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div key={transaction.id} className="flex gap-4 items-start">
                  <div className="flex-1 space-y-3">
                    <div>
                      <Text size="2" className="text-[#292929] mb-1 block">
                        Transaction Hash {index + 1}
                      </Text>
                      <TextField.Root
                        placeholder="Enter transaction hash..."
                        value={transaction.hash}
                        onChange={(e) =>
                          updateTransaction(
                            transaction.id,
                            "hash",
                            e.target.value,
                          )
                        }
                        size="2"
                      />
                    </div>
                    <div>
                      <Text size="2" className="text-[#292929] mb-1 block">
                        Description (Optional)
                      </Text>
                      <TextField.Root
                        placeholder="e.g., Token swap, NFT purchase..."
                        value={transaction.description || ""}
                        onChange={(e) =>
                          updateTransaction(
                            transaction.id,
                            "description",
                            e.target.value,
                          )
                        }
                        size="2"
                      />
                    </div>
                  </div>
                  {transactions.length > 1 && (
                    <Button
                      onClick={() => removeTransaction(transaction.id)}
                      variant="ghost"
                      color="red"
                      size="2"
                      className="mt-6"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full"
                size="3"
              >
                {isLoading ? (
                  <>
                    <Spinner size="2" />
                    Analyzing Transactions...
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-4 h-4" />
                    Analyze All Transactions
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Section */}
        {results.length > 0 && (
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#292929]">
                  Analysis Results
                </h3>
                <Button onClick={exportResults} size="2" variant="outline">
                  <DownloadIcon className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>

              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Text size="2" className="text-[#292929]">
                          Hash
                        </Text>
                        <Text size="2" className="text-blue-400 font-mono">
                          {result.hash.slice(0, 12)}...{result.hash.slice(-8)}
                        </Text>
                      </div>
                      <div>
                        <Text size="2" className="text-[#292929]">
                          Amount
                        </Text>
                        <Text size="2" className="text-[#292929]">
                          {result.amount.toFixed(4)} {result.currency}
                        </Text>
                      </div>
                      <div>
                        <Text size="2" className="text-[#292929]">
                          Estimated Tax
                        </Text>
                        <Text size="2" className="text-red-400">
                          ${result.estimatedTax.toFixed(2)}
                        </Text>
                      </div>
                      <div>
                        <Text size="2" className="text-[#292929]">
                          Status
                        </Text>
                        <Badge color="green" variant="soft">
                          {result.status}
                        </Badge>
                      </div>
                    </div>
                    {result.description && (
                      <div className="mt-2">
                        <Text size="1" className="text-[#292929]">
                          {result.description}
                        </Text>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="text-center p-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-lg border border-red-500/20">
                <Text size="2" className="text-[#292929]">
                  Total Estimated Tax Liability
                </Text>
                <Text size="6" weight="bold" className="text-red-400 mt-2">
                  $
                  {results
                    .reduce((sum, r) => sum + r.estimatedTax, 0)
                    .toFixed(2)}
                </Text>
                <Text size="1" className="text-[#292929] mt-2">
                  *This is an estimate. Consult a tax professional for accurate
                  calculations.
                </Text>
              </div>
            </div>
          </Card>
        )}

        {/* Help Section */}
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              Batch Analysis Tips
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[#292929] text-sm font-bold">
                  1
                </div>
                <div>
                  <Text size="3" weight="medium" className="text-[#292929]">
                    Prepare Your Data
                  </Text>
                  <Text size="2" className="text-[#292929]">
                    Gather all transaction hashes you want to analyze
                  </Text>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[#292929] text-sm font-bold">
                  2
                </div>
                <div>
                  <Text size="3" weight="medium" className="text-[#292929]">
                    Add Descriptions
                  </Text>
                  <Text size="2" className="text-[#292929]">
                    Optional descriptions help with record keeping
                  </Text>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[#292929] text-sm font-bold">
                  3
                </div>
                <div>
                  <Text size="3" weight="medium" className="text-[#292929]">
                    Export Results
                  </Text>
                  <Text size="2" className="text-[#292929]">
                    Download CSV for your tax records
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </Layout>
  );
}

export default BatchAnalyzer;

