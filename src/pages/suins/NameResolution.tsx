import React, { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { useSuins } from "../../hooks/useSuins/useSuins";
import { TextField, Button, Card, Flex, Text } from "@radix-ui/themes";
import { Copy, Check } from "lucide-react";

function NameResolution() {
  const { nameRecord, loading, error, fetchName } = useSuins();
  const [copied, setCopied] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      fetchName(input.trim());
    }
  };

  return (
    <Layout>
      <main className="p-6 space-y-8">
        {/* Header */}
        <Card className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            SuiNS - Name Resolution
          </h2>
          <p className="text-gray-300 mt-1">
            Resolve human-readable names to blockchain addresses.
          </p>
        </Card>

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <Flex gap="3" align="center">
            <TextField.Root
              placeholder="Enter a SuiNS name (e.g. Adeniyi.sui)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Resolving..." : "Resolve"}
            </Button>
          </Flex>
        </form>

        {/* Result */}
        {error && (
          <Card className="p-4 border border-red-600 bg-red-900/30 rounded-lg">
            <Text color="red" weight="bold">
              ⚠ Error: {error.message}
            </Text>
          </Card>
        )}

        {nameRecord && (
          <Card className="p-6 rounded-xl shadow-md border border-gray-700 bg-gray-900 space-y-4">
            <Text size="4" weight="bold" color="blue">
              {nameRecord.name}
            </Text>

            <Flex direction="column" gap="3">
              {/* Target Address */}
              <Flex justify="between" align="center">
                <Text color="gray">Target Address:</Text>
                <Flex align="center" gap="2" className="max-w-[65%] truncate">
                  <Text color="green" weight="medium" className="truncate">
                    {nameRecord.targetAddress}
                  </Text>
                  <button
                    onClick={() => handleCopy(nameRecord.targetAddress)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    {copied === nameRecord.targetAddress ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </Flex>
              </Flex>

              {/* Expiration */}
              <Flex justify="between">
                <Text color="gray">Expiration:</Text>
                <Text color="yellow">
                  {new Date(Number(nameRecord.expirationTimestampMs)).toLocaleString()}
                </Text>
              </Flex>

              {/* Walrus Site ID */}
              {nameRecord.data?.walrus_site_id && (
                <Flex justify="between" align="center">
                  <Text color="gray">Walrus Site ID:</Text>
                  <Flex align="center" gap="2" className="max-w-[65%] truncate">
                    <Text color="purple" className="truncate">
                      {nameRecord.data.walrus_site_id}
                    </Text>
                    <button
                      onClick={() => handleCopy(nameRecord.data.walrus_site_id)}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      {copied === nameRecord.data.walrus_site_id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </Card>
        )}
      </main>
    </Layout>
  );
}

export default NameResolution;
