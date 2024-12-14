// export const vUsername = (str) => {
//   //usernames must be 4-20 chars, letters number or underscores only.
//   str = str.trim();
//   if (!/^[a-zA-Z][a-zA-Z0-9_]{4,20}$/.test(str))
//     throw new Error("Invalid str.", { code: "BAD_USER_INPUT" });
//   return str;
// };

export const vTitle = (title) => {
  title = title.trim();
  if (title.length > 50 || title.length < 1)
    throw new Error("Invalid title, cannot be empty, max 50 chars.");
  return title;
};

export const vContent = (content) => {
  content = content.trim();
  if (content.length > 1000 || content.length < 1)
    throw new Error("Invalid content, cannot be empty, max 1000 chars.");
  return content;
};

export const vTrackSearch = (searchTerm) => {
  searchTerm = searchTerm.trim();
  if (searchTerm.length < 1)
    throw new Error("Invalid search term, cannot be empty.");
  return searchTerm;
};
