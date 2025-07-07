"use client";

import { useParams } from "next/navigation";

const Receipt = () => {
  const params = useParams<{ id: string }>();

  return <div>receitp {params.id}</div>;
};

export default Receipt;
