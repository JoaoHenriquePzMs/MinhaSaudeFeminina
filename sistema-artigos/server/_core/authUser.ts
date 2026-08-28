export type ServerUser = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
  taskUid?: string;
  isCron?: boolean;
};

const users = new Map<string, ServerUser>();

export function getUserByOpenId(openId: string) {
  return users.get(openId);
}

export function upsertUser(input: Partial<ServerUser> & Pick<ServerUser, "openId">) {
  const previous = users.get(input.openId);
  const now = new Date();
  const user: ServerUser = {
    id: previous?.id ?? users.size + 1,
    openId: input.openId,
    name: input.name ?? previous?.name ?? null,
    email: input.email ?? previous?.email ?? null,
    loginMethod: input.loginMethod ?? previous?.loginMethod ?? null,
    role: input.role ?? previous?.role ?? "user",
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
    lastSignedIn: input.lastSignedIn ?? now,
    ...(input.taskUid ? { taskUid: input.taskUid } : {}),
    ...(input.isCron ? { isCron: true } : {}),
  };

  users.set(user.openId, user);
  return user;
}
