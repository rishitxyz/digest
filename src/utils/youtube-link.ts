export const convertToStandardYouTubeLink = (url: string): string => {
  // 2. Split the string at '/embed/' and grab everything after it
  const afterEmbed = url.split('/embed/')[1]

  // 3. The video ID ends where the query parameters (?) begin.
  // Splitting by '?' and taking the first part isolates just the ID.
  const videoId = afterEmbed.split('?')[0]

  // 4. Reconstruct the standard watch link
  return `https://www.youtube.com/watch?v=${videoId}`
}
