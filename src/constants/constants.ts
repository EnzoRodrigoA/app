import { startOfWeek } from "date-fns";

const mondayFromThreeWeeksAgo = startOfWeek(
  new Date().getTime() - 86400000 * 21, // - 21 dias (3 semanas) em milisegundos da semana atual
  {
    weekStartsOn: 1, // Iniciar na segunda (1)
  }
);

export const data = new Array(7).fill(null).map((_, weekIndex) => {
  return new Array(7).fill(null).map((__, dayIndex) => {
    const day = new Date(
      mondayFromThreeWeeksAgo.getTime() + 86400000 * (weekIndex * 7 + dayIndex)
    );

    const value = Math.random();

    return {
      day,
      value,
    };
  });
});
