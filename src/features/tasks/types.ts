import { TaskComments } from '@/types/appwrite'

export interface PopulatedComment extends TaskComments {
  author: {
    $id: string
    name: string
    email: string
  }
}
