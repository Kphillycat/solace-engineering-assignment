import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return {
      select: (..._args: any[]) => ({
        from: (..._args: any[]) => ({
          where: (..._args: any[]) => ({
            limit: (..._args: any[]) => ({
              offset: (..._args: any[]) => [{ count: 0 }],
            }),
          }),
        }),
      }),
      insert: (..._args: any[]) => ({
        values: (..._args: any[]) => ({
          returning: (..._args: any[]) => [],
        }),
      }),
    };
  }

  // for query purposes
  const queryClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(queryClient);
  return db;
};

export default setup();
