import { Card, Heading, Box, Text } from "@radix-ui/themes";

export function NewsCard({ news }) {
  return (
    <Card style={{ flex: 1 }}>
      <Heading size="4" mb="3">
        Latest News
      </Heading>
      <Box>
        {news.map((newsItem, i) => (
          <Box key={i} mb="2">
            <Text weight="bold">{newsItem.title}</Text> &nbsp;
            <Text size="1" color="gray">
              {newsItem.time}
            </Text>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
