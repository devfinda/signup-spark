import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import Button from './Button';
import { useTaskStore } from '../store/taskStore';
import type { Comment } from '../types/task';

interface TaskCommentsProps {
  campaignId: string;
  taskId: string;
}

export default function TaskComments({ campaignId, taskId }: TaskCommentsProps) {
  const task = useTaskStore((state) => 
    state.getTasksByCampaign(campaignId).find(t => t.id === taskId)
  );
  const updateTask = useTaskStore((state) => state.updateTask);
  const [newComment, setNewComment] = useState('');

  if (!task) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      text: newComment.trim(),
      userId: 'anonymous',
      userName: task.assignedTo || 'Anonymous',
      userPicture: 'https://ui-avatars.com/api/?name=Anonymous',
      createdAt: new Date().toISOString(),
    };

    updateTask(campaignId, taskId, {
      comments: [...(task.comments || []), comment],
    });

    setNewComment('');
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Comment Input */}
      <div className="flex gap-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={2}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
        />
        <Button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="self-end"
        >
          <Send className="w-4 h-4 mr-2" />
          Comment
        </Button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {task.comments?.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img
              src={comment.userPicture}
              alt={comment.userName}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">
                    {comment.userName}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}