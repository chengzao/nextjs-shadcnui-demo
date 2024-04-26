import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
    const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY || "";

    const accessToken = jwt.sign({ userId: 123 }, JWT_SECRET_KEY, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign({ userId: 123 }, REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: "3m",
    });

    return Response.json(
      {
        code: 0,
        message: "success",
        data: { access_token: accessToken, refresh_token: refreshToken },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        code: 1,
        message: "error",
      },
      { status: 500 }
    );
  }
}
