import { Layout } from "../../components/layout/Layout";
import { Text, Button, Flex, Box } from "@radix-ui/themes";
import CardComponent from "@/components/cards";
import {
  PieChartIcon,
  MagnifyingGlassIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import { useNavigate } from "react-router";

function FinanceOverview() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Transaction Analyzer",
      description:
        "Analyze individual Sui transactions for tax implications and detailed insights.",
      icon: MagnifyingGlassIcon,
      path: "/finance/transaction-analyzer",
      color: "blue",
    },
    {
      title: "Batch Analyzer",
      description:
        "Analyze multiple transactions at once for comprehensive tax reporting.",
      icon: FileTextIcon,
      path: "/finance/batch-analyzer",
      color: "green",
    },
  ];

  return (
    <Layout>
      <main className="p-6 space-y-8">
        {/* Header */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#292929]">
            Finance & Tax Analysis
          </h2>
          <p className="text-[#292929] mt-1">
            Comprehensive tools for analyzing Sui transactions and calculating
            tax implications.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardComponent>
            <div className="p-6 text-center">
              <PieChartIcon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <Text size="2" className="text-[#292929]">
                Total Analyzed
              </Text>
              <Text size="6" weight="bold" className="text-[#292929]">
                0
              </Text>
            </div>
          </CardComponent>
          <CardComponent>
            <div className="p-6 text-center">
              <Text size="2" className="text-[#292929]">
                Tax Liability
              </Text>
              <Text size="6" weight="bold" className="text-red-400">
                $0.00
              </Text>
            </div>
          </CardComponent>
          <CardComponent>
            <div className="p-6 text-center">
              <Text size="2" className="text-[#292929]">
                Countries Supported
              </Text>
              <Text size="6" weight="bold" className="text-green-400">
                10+
              </Text>
            </div>
          </CardComponent>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <CardComponent
                key={index}
                className="hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div className="p-6">
                  <Flex align="center" gap="4" className="mb-4">
                    <div
                      className={`p-3 rounded-lg bg-${feature.color}-500/20`}
                    >
                      <IconComponent
                        className={`w-6 h-6 text-${feature.color}-400`}
                      />
                    </div>
                    <Box>
                      <Text size="4" weight="bold" className="text-[#292929]">
                        {feature.title}
                      </Text>
                    </Box>
                  </Flex>
                  <Text size="2" className="text-[#292929] mb-4">
                    {feature.description}
                  </Text>
                  <Button
                    onClick={() => navigate(feature.path)}
                    className="w-full"
                    size="2"
                  >
                    Get Started
                  </Button>
                </div>
              </CardComponent>
            );
          })}
        </div>

        {/* Information Card */}
        <CardComponent>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#292929] mb-4">
              About Tax Analysis
            </h3>
            <div className="space-y-3">
              <Text size="3" className="text-[#292929]">
                Our transaction analyzer helps you understand the tax
                implications of your Sui blockchain transactions. By analyzing
                transaction details and applying country-specific tax rates, we
                provide estimates for potential tax liabilities.
              </Text>
              <Text size="3" className="text-[#292929]">
                <strong className="text-[#292929]">Important:</strong> These
                calculations are estimates only. Tax laws vary by jurisdiction
                and individual circumstances. Always consult with a qualified
                tax professional for accurate tax advice and compliance.
              </Text>
            </div>
          </div>
        </CardComponent>
      </main>
    </Layout>
  );
}

export default FinanceOverview;
