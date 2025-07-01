import { getTemporaryAccessToken } from "@/actions/getTemporaryAccessToken";
import SchematicEmbed from "./SchematicEmbed";

const SchematicComponent = async ({
  componentId,
}: {
  componentId?: string;
}) => {
  if (!componentId) return null;

  const accessToken = await getTemporaryAccessToken(); // get temporary access token

  if (!accessToken) throw new Error("No access token found");

  return <SchematicEmbed accessToken={accessToken} componentId={componentId} />;
};

export default SchematicComponent;
