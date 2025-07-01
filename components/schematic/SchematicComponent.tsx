import { getTemporaryAccessToken } from "@/actions/getTemporaryAccessToken";
import React from "react";

const SchematicComponent = async ({ componentId }: { componentId: string }) => {
  if (!componentId) return null;

  const accessToken = await getTemporaryAccessToken(); // get temporary access token

  if (!accessToken) throw new Error("No access token found");
  return <div>SchematicComponent</div>;
};

export default SchematicComponent;
