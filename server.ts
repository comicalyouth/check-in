import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

const sessions = new Map<string, { createdAt: number }>();
const sessionTimeout = 30 * 60 * 1000; // 30分

function isValidSession(sessionId: string | null): boolean {
  if (!sessionId) return false;
  const session = sessions.get(sessionId);
  if (!session || Date.now() - session.createdAt > sessionTimeout) {
    sessions.delete(sessionId); // セッションの有効期限が切れていれば削除
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  const pathname = new URL(req.url).pathname;

  // QRコードの認証（POSTリクエスト）
  if (req.method === "POST" && pathname === "/check-in") {
    try {
      const { id } = await req.json();
      if (id === "comiculCheckIn" || id === "https://comiculstamp.deno.dev/") {
        const sessionId = crypto.randomUUID();
        sessions.set(sessionId, { createdAt: Date.now() });
        return new Response(
          JSON.stringify({ url: "/checkin.html", sessionId }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
        return new Response("Invalid QR code", { status: 400 });
      }
    } catch (error) {
      console.error("サーバーエラー:", error);
      return new Response(`サーバーエラー: ${error.message}`, { status: 500 });
    }
  }

  // checkin.htmlへのアクセス制限
  if (pathname === "/checkin.html") {
    const sessionId = new URL(req.url).searchParams.get("sessionId");

    if (!isValidSession(sessionId)) {
      return new Response("Unauthorized access", { status: 403 });
    }

    return serveDir(req, {
      fsRoot: "public",
      urlRoot: "",
      showDirListing: true,
      enableCors: true,
    });
  }

  // 他のページは通常通り提供
  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
