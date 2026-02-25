import { useMutation } from '@tanstack/react-query';

export function ContactForm() {
  const mutation = useMutation({
    mutationFn: (newMessage) => {
      return fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(newMessage),
      });
    },
    onSuccess: () => {
      alert("Message sent successfully!");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    mutation.mutate(Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm p-6">
      <input name="email" placeholder="Your Email" className="border p-2" required />
      <textarea name="message" placeholder="Your Message" className="border p-2" required />
      <button 
        type="submit" 
        disabled={mutation.isPending}
        className="bg-black text-white p-2 rounded disabled:bg-gray-400"
      >
        {mutation.isPending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}