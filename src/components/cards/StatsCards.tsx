import { Flex, Card, Heading, Text } from "@radix-ui/themes";

export function StatsCards() {
  return (
    <Flex gap="6" mb="6">
      <Card>
        <Text size="2" color="gray">
          Total Value Onchain
        </Text>
        <Heading size="5">$27.92B</Heading>
        <Text size="1" color="green">
          +7.30% from 30d ago
        </Text>
      </Card>
      <Card>
        <Text size="2" color="gray">
          Total Asset Holders
        </Text>
        <Heading size="5">372,292</Heading>
        <Text size="1" color="green">
          +8.80% from 30d ago
        </Text>
      </Card>
      <Card>
        <Text size="2" color="gray">
          Total Asset Issuers
        </Text>
        <Heading size="5">272</Heading>
      </Card>
      <Card>
        <Text size="2" color="gray">
          Total Stablecoin Value
        </Text>
        <Heading size="5">$273.07B</Heading>
        <Text size="1" color="green">
          +6.37% from 30d ago
        </Text>
      </Card>
      <Card>
        <Text size="2" color="gray">
          Total Stablecoin Holders
        </Text>
        <Heading size="5">190.45M</Heading>
        <Text size="1" color="green">
          +1.72% from 30d ago
        </Text>
      </Card>
    </Flex>
  );
}
