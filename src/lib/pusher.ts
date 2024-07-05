// import PusherClient from "pusher-js";
import Pusher from "pusher";
import { env } from "~/env";
// import { env } from "~/env";
//
// export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_KEY, {
//   cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
//   authEndpoint: "/api/pusher/auth",
// });
//
// let pusherInstance: PusherServer | null = null;
// import Pusher from "pusher";

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export { pusher };
// export const getPusherInstance = () => {
//   if (!pusherInstance) {
//     pusherInstance = new PusherServer({
//       appId: env.PUSHER_APP_ID,
//       key: env.NEXT_PUBLIC_PUSHER_KEY,
//       secret: env.PUSHER_SECRET,
//       cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
//       useTLS: true,
//     });
//   }
//   return pusherInstance;
// };
