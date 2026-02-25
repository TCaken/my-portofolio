import { useQuery } from '@tanstack/react-query';

// A simple function to fetch data from a public API or your own
const fetchProjects = async () => {
  const response = await fetch('https://api.github.com/users/tcaken/repos');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export function Projects() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  if (isLoading) return <div className="p-10 text-center">Loading Projects...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      {data.map((repo) => (
        <div key={repo.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
          <h3 className="font-bold text-lg">{repo.name}</h3>
          <p className="text-gray-600">{repo.description || "No description provided."}</p>
          <a href={repo.html_url} className="text-blue-500 underline mt-2 block">View Code</a>
        </div>
      ))}
    </section>
  );
}