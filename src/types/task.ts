export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPicture: string;
  createdAt: string;
  parentId?: string;
  responses?: Comment[];
}

export interface Task {
  id: string;
  name: string;
  quantity?: number;
  dueDate?: string;
  description?: string;
  status: 'OPEN' | 'TAKEN';
  assignedTo?: string;
  comments: Comment[];
}