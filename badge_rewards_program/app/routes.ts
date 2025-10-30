import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./solana/SolanaProvider.tsx", [
    index("routes/landing.tsx"),
    route("app", "routes/app.tsx"),
    route("demo", "routes/demo.tsx"),
    route("player", "routes/player.tsx"),
    route("docs", "routes/docs.tsx"),
  ]),
] satisfies RouteConfig;