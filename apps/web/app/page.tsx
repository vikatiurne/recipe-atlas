import { LOCALE, DIFFICULTY, getCalorieLevel } from '@recipe-atlas/shared';

export default function HomePage() {
  return (
    <div>
      <h1>Recipe Atlas</h1>
      <p>Locale: {LOCALE.UK}</p>
      <p>Difficulty: {DIFFICULTY.EASY}</p>
      <p>Calorie level for 250 kcal: {getCalorieLevel(250)}</p>
    </div>
  );
}
