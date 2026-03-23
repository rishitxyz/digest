export interface Comment {
  author: string
  body: string
  score: number
  replies?: Comment[]
}
