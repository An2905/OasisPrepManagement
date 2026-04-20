import "server-only";

function pickCommit() {
  // Railway exposes one (or more) of these depending on build environment.
  const commit =
    process.env.RAILWAY_GIT_COMMIT_SHA ??
    process.env.RAILWAY_GIT_COMMIT ??
    process.env.GITHUB_SHA ??
    process.env.VERCEL_GIT_COMMIT_SHA ??
    "";
  return commit ? commit.slice(0, 7) : "";
}

export function BuildStamp() {
  const sha = pickCommit();
  const env = process.env.RAILWAY_ENVIRONMENT_NAME ?? process.env.NODE_ENV ?? "";
  const label = sha ? `${env} • ${sha}` : env;

  return (
    <div className="text-[11px] text-zinc-500">
      {label ? <>build: {label}</> : <>build: local</>}
    </div>
  );
}

