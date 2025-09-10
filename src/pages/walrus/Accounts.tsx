import { Layout } from "../../components/layout/Layout";
import { useWalrusAccount } from "../../hooks/usewalrus/useWalrusAccount";
import { Table, Button, Flex, Text, IconButton } from "@radix-ui/themes";
import CardComponent from "@/components/cards";
import { Copy, Download } from "lucide-react";
import Account from "../../components/tables/walrustable/Accounts";
import Validators from "../../components/tables/walrustable/Validators";

function Accounts() {
  return (
    <Layout>
      <main className="p-6 space-y-8">
        <CardComponent>
          <h2 className="text-2xl font-semibold text-[#292929]">
            Walrus - Account Details
          </h2>
          <p className="text-[#292929] mt-1">
            Overview of accounts and related metrics.
          </p>
        </CardComponent>
        <div className="flex flex-col gap-12">
          <Account />
          <Validators />
        </div>
      </main>
    </Layout>
  );
}

export default Accounts;
