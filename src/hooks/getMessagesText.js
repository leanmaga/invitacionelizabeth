export const getMessagesText = (comments) => {
  const count = comments?.length || 0;
  if (count === 0) return "aún no tiene mensajes, escribe uno 💌";
  if (count === 1) return "ver 1 mensaje";
  return `ver ${count} mensajes`;
};
