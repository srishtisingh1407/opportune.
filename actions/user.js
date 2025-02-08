import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw Error("user not found");
  try {
    const result = await db.$transcation(
      async (tx) => {
        // finding if the industry exists
        let industryInsights = await tx.industryInsights.findUnique({
          where: {
            industry: data.industry,
          },
        });




        //new industry doesnt exist,  create it with default values

        if(!industryInsights){
            industryInsights = await  tx.industryInsights.create({
                data:{
                    industry : data.industry,
                    salaryRanges: [],
                    growthRate: 0,
                    demandandlevel : "Medium"
                }
            })
        }

      },
      {
        timeout: 10000,
      }
    );
  } catch (error) {
    console.log("Error updating user and industry:", error.message);
    throw new Error("Falied to update profile");
  }
}
