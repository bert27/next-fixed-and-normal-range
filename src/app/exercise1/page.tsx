import { RangeSelector } from "@/components/range/range";
import { fetchRangeValues } from "../services/api-service";
import Layout from "@/components/layout";

export default async function Exercise1Page() {
  const { data, error } = await fetchRangeValues();

  return (
    <Layout error={error}>
      <h1>Mango</h1>
      <h2>Reusable Input Range</h2>
      {data && (
        <RangeSelector mode="normal" min={data.min} max={data.max} step={1} />
      )}
    </Layout>
  );
}