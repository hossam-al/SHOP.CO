import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Nordic Cart";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#fbfaf7",
          color: "#172033",
          padding: 72,
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 28, color: "#c46b48", fontWeight: 700 }}>Nordic Cart</div>
        <div style={{ marginTop: 28, fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>
          {title}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
