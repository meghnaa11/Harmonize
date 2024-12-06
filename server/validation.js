import { GraphQLError } from "graphql";
export const vUsername = (str) => {
  //usernames must be 4-20 chars, letters number or underscores only.
  str = str.trim();
  if (!/^[a-zA-Z][a-zA-Z0-9_]{4,20}$/.test(str))
    throw new GraphQLError("Invalid str.", { code: "BAD_USER_INPUT" });
  return str;
};

export const vTitle = (title) => {
  title = title.trim();
  if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9.\-,:' ]{1,50}$/.test(title))
    throw new GraphQLError("Invalid title.", { code: "BAD_USER_INPUT" });
  return title;
};
