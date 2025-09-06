import { useSuinsClient } from "../../contexts/SuinsClientContext";

export function Suins() {
  const suinsClient = useSuinsClient();

  async function fetchName() {
    const name = await suinsClient.getNameRecord("example.sui");
    console.log(name);
  }

  return <button onClick={fetchName}>Get Name</button>;
}
