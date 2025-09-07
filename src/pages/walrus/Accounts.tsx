import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useWalrusAccount } from "../../hooks/usewalrus/useWalrusAccount";
import {
  Table,
  Button,
  Flex,
  Text,
  Card,
  IconButton,
} from "@radix-ui/themes";
import { Copy, Download } from "lucide-react";
import Account from "../../components/tables/walrustable/Accounts";
import Validators from "../../components/tables/walrustable/Validators";

function Accounts() {

  return (
    <Layout>
      <main className="p-6 space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
          <h2 className="text-2xl font-semibold text-white">
            Walrus - Account Details
          </h2>
          <p className="text-gray-300 mt-1">
            Overview of accounts and related metrics.
          </p>
        </div>
        <div className="flex flex-col gap-12">
          <Account />
          <Validators />
        </div>
      </main>
    </Layout>
  );
}

export default Accounts;
