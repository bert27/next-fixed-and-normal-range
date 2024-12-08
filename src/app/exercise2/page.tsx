import { RangeSelector } from "@/components/range/range";
import { fetchFixedRangeValues } from "../services/api-service";
import Layout from "@/components/layout";

export default async function Exercise2Page() {
  const { data, error } = await fetchFixedRangeValues();

  return (
    <Layout error={error}>
      <h1>Mango</h1>
      <h2>Fixed Values Range</h2>
      {data?.rangeValues && (
        <RangeSelector mode="fixed" values={data.rangeValues} />
      )}
    </Layout>
  );
}
