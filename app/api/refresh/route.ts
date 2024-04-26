import jwt from "jsonwebtoken";
import { type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { refresh_token } = await req.json();

  if (!refresh_token) {
    return Response.json(
      { code: 1, message: "Invalid refresh token." },
      {
        status: 403,
      }
    );
  }
  // 验证refreshToken
  try {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
    const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY || "";

    const payload: any = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET_KEY);

    // 如果refreshToken是有效的, 创建新的accessToken
    const accessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET_KEY, {
      expiresIn: "1m",
    });

    return Response.json(
      { code: 0, data: accessToken },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      { code: 1, message: "Invalid refresh token." },
      {
        status: 403,
      }
    );
  }
}
