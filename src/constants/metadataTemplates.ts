export const guildMetadata = (title: string, description: string) => ({
  title: title === "Home" ? "Nww" : `Nww | ${title}`,
  description,
})