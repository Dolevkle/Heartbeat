import {z} from "zod";

import {createTRPCRouter, protectedProcedure, publicProcedure,} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({text: z.string()}))
        .query(({input}) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    update: protectedProcedure
        .input(z.object({
            id: z.string(),
            age: z.number().min(1),
            sexualPreference: z.string().min(1),
            gender: z.string().min(1)
        }))
        .mutation(async ({ctx, input}) => {
            // simulate a slow db call
            const {id, gender, sexualPreference, age} = input;
            return ctx.db.user.update({
                where: {id},
                data: {
                    gender,
                    sexualPreference,
                    age,
                },
            });

        }),

});
