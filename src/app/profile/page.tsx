import { getServerAuthSession } from "~/server/auth";
import ProfileDisplay from "../_components/profile/ProfileDisplay";

export default async function Page() {
  const session = await getServerAuthSession();
  const user = session?.user;

  return <ProfileDisplay authUser={user} />;
}
