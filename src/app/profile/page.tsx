import { getServerAuthSession } from "~/server/auth";
import ProfileClient from "../_components/profile/ProfileClient";

export default async function Page() {
  const session = await getServerAuthSession();
  const user = session?.user;

  return <ProfileClient user={user} />;
}
