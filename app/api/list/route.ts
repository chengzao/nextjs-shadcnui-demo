import jwt from "jsonwebtoken";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (token == null)
      return Response.json(
        { code: 1, message: "Access Token Required" },
        { status: 403 }
      );
    return jwt.verify(token, JWT_SECRET_KEY, (err: any, user: any) => {
      if (err) {
        return Response.json(
          { code: 1, message: "Invalid Access Token" },
          { status: 401 }
        );
      } else {
        const data = [
          { id: 1, name: "Item One" },
          { id: 2, name: "Item Two" },
          { id: 3, name: "Item Three" },
        ];
        return Response.json(
          { code: 0, message: "Success", data },
          { status: 200 }
        );
      }
    });
  } catch (error) {
    console.log("error", error);
  }
}
