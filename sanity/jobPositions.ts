import { client } from "./client";

export interface JobPositionOffer {
  id: string;
  title: string;
  tasks: {
    id: string;
    label: string;
    required: boolean;
    order: number | null;
  }[];
}

export async function getActiveJobPositions(): Promise<JobPositionOffer[]> {
  const query = `*[_type == "jobPosition" && active == true]{
    _id,
    title,
    tasks[]{
      _key,
      label,
      required,
      order
    }
  }`;

  const items = await client.fetch(query);
  return (items || [])
    .map((it: any) => {
      const title = (it?.title || "").trim();
      const tasks = Array.isArray(it?.tasks)
        ? it.tasks
            .map((task: any, index: number) => {
              // Backward compatibility with older documents where tasks were plain strings.
              if (typeof task === "string") {
                const label = task.trim();
                if (!label) return null;
                return {
                  id: `legacy-${index}`,
                  label,
                  required: true,
                  order: index,
                };
              }

              const label = (task?.label || "").trim();
              if (!label) return null;
              return {
                id: (task?._key || `${index}`).toString(),
                label,
                required: task?.required !== false,
                order:
                  typeof task?.order === "number" &&
                  Number.isFinite(task.order)
                    ? task.order
                    : null,
              };
            })
            .filter(
              (
                task,
              ): task is {
                id: string;
                label: string;
                required: boolean;
                order: number | null;
              } => Boolean(task),
            )
            .sort((a, b) => {
              if (a.order === null && b.order === null) return 0;
              if (a.order === null) return 1;
              if (b.order === null) return -1;
              return a.order - b.order;
            })
        : [];

      return {
        id: (it?._id || "").toString(),
        title,
        tasks,
      };
    })
    .filter((it: JobPositionOffer) => it.title.length > 0);
}
