import { useTaskStore } from '../store/taskStore';

interface TaskPreviewProps {
  campaignId: string;
}

export default function TaskPreview({ campaignId }: TaskPreviewProps) {
  const tasks = useTaskStore((state) => state.getTasksByCampaign(campaignId));

  return (
    <div className="border rounded-lg p-6 bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">Preview</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg border shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{task.name}</h3>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                OPEN
              </span>
            </div>
            {task.quantity && (
              <p className="text-sm text-gray-600">
                Quantity needed: {task.quantity}
              </p>
            )}
            {task.dueDate && (
              <p className="text-sm text-gray-600">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
            {task.description && (
              <p className="text-sm text-gray-600 mt-2">{task.description}</p>
            )}
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-gray-500">
            No tasks to preview. Add some tasks to see how they'll appear to participants.
          </p>
        )}
      </div>
    </div>
  );
}