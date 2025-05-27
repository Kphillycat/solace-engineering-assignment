import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { NextRequest } from "next/server";
import { sql, or, ilike } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    // Build base query
    let whereClause = undefined;
    if (search) {
      whereClause = or(
        ilike(advocates.firstName, `%${search}%`),
        ilike(advocates.lastName, `%${search}%`),
        ilike(advocates.city, `%${search}%`),
        ilike(advocates.degree, `%${search}%`)
      );
    }

    const [{ count }] = await (db
      .select({ count: sql`count(*)`.as('count') })
      .from(advocates)
      .where(whereClause) as any);

    // Main query with pagination and search
    const results = await (db
      .select()
      .from(advocates)
      .where(whereClause)
      .limit(limit)
      .offset(offset) as any);

    return Response.json({
      data: results,
      meta: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit),
      },
    });
  } catch (err: any) {
    return Response.json({ error: err.message || "Failed to fetch advocates" }, { status: 500 });
  }
}

