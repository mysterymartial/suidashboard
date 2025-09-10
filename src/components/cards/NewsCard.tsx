import { Card, Heading, Box, Text } from "@radix-ui/themes";

export function NewsCard({ news }: { news: any[] }) {
  return (
    <Card style={{ flex: 1 }}>
      <Heading size="4" mb="3">
        Latest News
      </Heading>
      <Box>
        {news.map((newsItem: any, i: number) => (
          <Box key={i} mb="2">
            <Text weight="bold">{newsItem.title}</Text> &nbsp;
            <Text size="1" className="text-[#292929]">
              {newsItem.time}
            </Text>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
