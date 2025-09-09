import { ConnectButton } from "@mysten/dapp-kit";
import { MagnifyingGlassIcon, BellIcon, GearIcon } from "@radix-ui/react-icons";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-700 px-6 py-3.5 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-r border-gray-700 pr-4">
            <h1 className="text-2xl font-bold text-white">Sui Dashboard</h1>
          </div>
          <div className="hidden md:block">
            <p className="text-gray-300 text-sm w-[150px]">
              Every tokenized asset on Sui, in one place.
            </p>
          </div>
        </div>

        <div className="relative hidden md:block">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search "
            className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg"
          />
        </div>
        <div className="flex items-center gap-4">

          {/* <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <BellIcon className="w-5 h-5" />
          </button>

          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <GearIcon className="w-5 h-5" />
          </button> */}

          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
